const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User.model");
const bcrypt=require("bcryptjs");
const crypto=require('crypto');
const {generateAccessToken, generateRefreshToken, setRefreshCookie}=require("../utils/generateToken");
const {success}=require("../utils/ApiResponse");
const jwt     = require('jsonwebtoken');
const {sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../services/email.service');


exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
        throw new ApiError(400, 'Email already registered');
    const hashed = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ name, email, password: hashed, verifyToken });

    const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${verifyToken}`;
    try {
    await sendVerificationEmail(user, verifyUrl);
    } catch (err) {
    console.error('[register] Verification email failed:', err.message);
    }

    success(res, 201, "Registered! Please verify your email");
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token || req.body.token;
  if (!token) throw new ApiError(400, 'Verification token is required');
 
  const user = await User.findOne({ verifyToken: token });
  if (!user) throw new ApiError(400, 'Invalid or expired verification token');
 
  user.isVerified  = true;
  user.verifyToken = undefined;  
  await user.save();
 
  try {
    await sendWelcomeEmail(user);
  } catch (err) {
    console.error('[verifyEmail] Welcome email failed:', err.message);
  }
 
  success(res, 200, null, 'Email verified successfully. You can now log in.');
});
 

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
        throw new ApiError(401, "Invalid email or password");

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken.push({ token: refreshToken, createdAt: new Date() });
    await user.save();
    setRefreshCookie(res, refreshToken);
    success(res, 200, { user:{ id: user._id, name: user.name, email: user.email, role: user.role }, accessToken }, 'Login Successful');
});

exports.refreshToken=asyncHandler(async(req,res)=>{
    const token=req.cookies.refreshToken;
    if(!token) throw new ApiError(401, "No refresh token");

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }
    const user=await User.findById(decoded.id);
    const exists = user?.refreshToken?.some(t => t.token === token);
    if(!exists) throw new ApiError(401,'Invalid refresh Token');
    const newAccessToken=generateAccessToken(user._id,user.role);
    success(res,200,{accessToken:newAccessToken, user:{id:user._id, name:user.name, email:user.email, role:user.role}});

});

exports.logout=asyncHandler(async(req,res)=>{
    const token=req.cookies.refreshToken;
    if(token){
        await User.findByIdAndUpdate(req.user._id, {$pull:{refreshToken:{token}}});

    }
    res.clearCookie('refreshToken');
    success(res,200,null,'Logged out');
})

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const genericMsg = 'If that email exists, a reset link has been sent';
 
  if (!user) return success(res, 200, null, genericMsg);
 
  const rawToken    = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
 
  user.resetToken       = hashedToken;
  user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); 
  await user.save();
 
  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${rawToken}`;
 
  try {
    await sendPasswordResetEmail(user, resetUrl);
  } catch (err) {
    user.resetToken       = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    throw new ApiError(500, 'Failed to send reset email. Please try again.');
  }
 
  success(res, 200, null, genericMsg);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) throw new ApiError(400, 'Token and new password are required');
  
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
 
  const user = await User.findOne({
    resetToken:       hashedToken,
    resetTokenExpiry: { $gt: new Date() },   
  });
 
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');
 
  user.password         = await bcrypt.hash(password, 12);
  user.resetToken       = undefined;
  user.resetTokenExpiry = undefined;
  user.refreshToken     = [];
  await user.save();
 
  success(res, 200, null, 'Password reset successfully. Please log in.');
});

