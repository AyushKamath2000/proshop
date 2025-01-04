import express  from "express";
const router = express.Router();
import {authUsers, logoutUser, registerUser, getUserProfile, updateUserProfile, getUsers, getUserByID, updateUserByID, deleteUsers} from "../controllers/UserController.js";
import {admin, protect} from "../middleware/authMiddleware.js";

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/auth', authUsers);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').get(protect, admin, getUserByID).put(protect, admin, updateUserByID).delete(protect, admin, deleteUsers);


export default router;
