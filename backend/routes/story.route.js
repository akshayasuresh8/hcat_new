// backend/routes/story.route.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { 
    createStory, 
    getUserStories, 
    getAllStories, 
    markStoryAsViewed 
} from "../controllers/story.controller.js";

const router = express.Router();

router.post("/create", isAuthenticated, upload.single('media'), createStory);
router.get("/user/:userId", isAuthenticated, getUserStories);
router.get("/all", isAuthenticated, getAllStories);
router.post("/:storyId/view", isAuthenticated, markStoryAsViewed);

export default router;