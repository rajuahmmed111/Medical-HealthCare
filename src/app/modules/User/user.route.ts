import  express  from 'express';
import { UserController } from './user.controller';
const router = express.Router();

// get by user role
router.get('/get-user',  UserController.getUserByRole);


export const userRoute = router;