import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import {
  createNewBrand,
  deleteBrandById,
  getAllBrands,
  getBrandById,
  updateBrandById,
} from '../controllers/brandsController';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import {
  createBrandValidation, brandIdValidation, updateBrandValidation,
} from '../validators/brandFieldsValidation';
import { methodNotAllowed } from '../controllers/suspicionController';
import uploadToMemory from '../middlewares/memoryUploadMiddleware';

const brandRouter = Router();

brandRouter.route('/')
  .get(
    authMiddleware,
    getAllBrands,
  )
  .post(
    uploadToMemory,
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ bodySchema: createBrandValidation }),
    createNewBrand,
  );

brandRouter.route('/:id')
  .get(
    authMiddleware,
    validateJoiRequest({ paramsSchema: brandIdValidation }),
    getBrandById,
  )
  .put(
    uploadToMemory,
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: brandIdValidation }),
    validateJoiRequest({ bodySchema: updateBrandValidation }),
    updateBrandById,
  )
  .delete(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: brandIdValidation }),
    deleteBrandById,
  );

brandRouter.route('*').all(methodNotAllowed);
export default brandRouter;
