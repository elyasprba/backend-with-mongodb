import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import cloudinary from '../config/claudinary';

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => {
    return {
      folder: 'learn-mongo',
    };
  },
});

// size
const limit = {
  fileSize: 4e6,
};

//  file upload
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const imageOnlyFilter = (_req: Request, file: any, cb: any) => {
  const extName = path.extname(file.originalname);
  const allowedExt = /jpg|jpeg|png|JPG|JPEG|PNG/;
  if (!allowedExt.test(extName))
    return cb(new Error('File Extension JPG or PNG 2mb'), false);
  cb(null, true);
};

// upload image
const imageUpload = multer({
  storage: cloudinaryStorage,
  limits: limit,
  fileFilter: imageOnlyFilter,
}).single('image');

export default imageUpload;
