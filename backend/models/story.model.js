// backend/models/story.model.js
import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    media: { type: String, required: true }, // URL to image/video
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { 
        type: Date, 
        default: function() {
            const date = new Date();
            date.setHours(date.getHours() + 24); // Stories expire after 24 hours
            return date;
        }
    },
    viewers: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        viewedAt: { type: Date, default: Date.now }
    }],
    type: { type: String, enum: ['image', 'video'], default: 'image' }
}, {
    timestamps: true
});

// Index for efficient expiry queries
storySchema.index({ expiresAt: 1 });

// Middleware to automatically remove expired stories
storySchema.pre('find', function() {
    this.where({ expiresAt: { $gt: new Date() } });
});

export const Story = mongoose.model('Story', storySchema);