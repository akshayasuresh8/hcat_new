// backend/controllers/story.controller.js
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";

export const createStory = async (req, res) => {
    try {
        const media = req.file;
        const authorId = req.id;

        if (!media) return res.status(400).json({ message: 'Media required', success: false });

        // Image optimization
        const optimizedImageBuffer = await sharp(media.buffer)
            .resize({ width: 1080, height: 1920, fit: 'contain' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // Upload to cloudinary
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        // Create story
        const story = await Story.create({
            media: cloudResponse.secure_url,
            author: authorId,
            type: 'image'
        });

        await story.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'Story created successfully',
            story,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const getUserStories = async (req, res) => {
    try {
        const userId = req.params.userId;
        const stories = await Story.find({ 
            author: userId,
            expiresAt: { $gt: new Date() }
        })
        .sort({ createdAt: -1 })
        .populate('author', 'username profilePicture');

        return res.status(200).json({
            stories,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const getAllStories = async (req, res) => {
    try {
        const userId = req.id;
        
        // Get user's following list
        const user = await User.findById(userId);
        const following = user.following;

        // Get stories from followed users and user's own stories
        const stories = await Story.find({
            author: { $in: [...following, userId] },
            expiresAt: { $gt: new Date() }
        })
        .sort({ createdAt: -1 })
        .populate('author', 'username profilePicture')
        .populate('viewers.user', 'username profilePicture');

        // Group stories by user
        const storiesByUser = stories.reduce((acc, story) => {
            if (!acc[story.author._id]) {
                acc[story.author._id] = {
                    user: story.author,
                    stories: []
                };
            }
            acc[story.author._id].stories.push(story);
            return acc;
        }, {});

        return res.status(200).json({
            stories: Object.values(storiesByUser),
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const markStoryAsViewed = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Story not found', success: false });
        }

        // Add viewer if not already viewed
        if (!story.viewers.some(viewer => viewer.user.toString() === userId)) {
            story.viewers.push({ user: userId });
            await story.save();
        }

        return res.status(200).json({
            message: 'Story marked as viewed',
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};