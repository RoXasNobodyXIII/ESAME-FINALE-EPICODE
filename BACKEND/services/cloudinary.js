const cloudinary = require('cloudinary').v2;

// Initialize Cloudinary using env vars
// Required env vars:
// - CLOUDINARY_CLOUD_NAME
// - CLOUDINARY_API_KEY
// - CLOUDINARY_API_SECRET
// Optional:
// - CLOUDINARY_FOLDER (default: 'uploads')

function initCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary env vars missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

async function uploadBuffer(buffer, filename, folder = process.env.CLOUDINARY_FOLDER || 'uploads') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined,
        resource_type: 'image',
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

module.exports = { initCloudinary, uploadBuffer };
