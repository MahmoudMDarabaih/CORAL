import multer, { StorageEngine } from 'multer';

const storage: StorageEngine = multer.memoryStorage();

const IMAGE_SIZE_LIMIT = process.env.IMAGE_SIZE_LIMIT || '2000000';

const memoryUpload = multer({
  storage,
  limits: {
    fileSize: parseInt(IMAGE_SIZE_LIMIT), // 2 MB limit for file size.
  },
});

export default memoryUpload;
