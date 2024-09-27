import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';
import { methodNotAllowed } from '../controllers/suspicionController';
import { registerValidation, loginValidation } from '../validators/authFieldsValidation';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';

const authRouter = Router();

authRouter.route('/signup').post(validateJoiRequest({ bodySchema: registerValidation }), signup);
authRouter.route('/login').post(validateJoiRequest({ bodySchema: loginValidation }), login);
authRouter.route('/logout').get(authMiddleware, logout);

authRouter.route('/protected').get(authMiddleware, adminMiddleware, (req, res) => {
  res.send('Hello, authenticated user!');
});

authRouter.route('*').all(methodNotAllowed);

export default authRouter;
