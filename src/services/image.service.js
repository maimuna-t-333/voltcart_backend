const cloudinary = require('../config/cloudinary');

exports.uploadToCloudinary = (buffer, folder = 'techvault/products') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    );
    stream.end(buffer);
  });

exports.deleteFromCloudinary = publicId =>
  cloudinary.uploader.destroy(publicId);
