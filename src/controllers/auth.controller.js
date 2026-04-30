const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User.model");
const bcrypt=require("bcryptjs");
const crypto=require('crypto');
const {generateAccessToken, generateRefreshToken, setRefreshCookie}=require("../utils/generateToken");
const {success}=require("../utils/ApiResponse");


exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
        throw new ApiError(400, 'Email already registered');
    const hashed = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ name, email, password: hashed, verifyToken });

    //TODO:send verification email
    success(res, 201, "Registered! Please verify your email");
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
    const jwt=require("jsonwebtoken");
    const decoded=jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
    const user=await User.findById(decoded.id);
    const exists=user?.refreshTokens?.some(t=>t.token===token);
    if(!exists) throw new ApiError(401,'Invalid refresh Token');
    const newAccess=generateAccessToken(user._id,user.role);
    success(res,200,{accesstoken:newAccess, user:{id:user._id, name:user.name, email:user.email, role:user.role}});

});

exports.logout=asyncHandler(async(req,res)=>{
    const token=req.cookies.refreshToken;
    if(token){
        await User.findByIdAndUpdate(req.user._id, {$pull:{refreshToken:{token}}});

    }
    res.clearCookie('refreshToken');
    success(res,200,null,'Logged out');
})

