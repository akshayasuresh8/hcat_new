import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: { type: String, default: '' },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Add index on expiresAt for efficient querying
postSchema.index({ expiresAt: 1 });

// Add middleware to check expiration before each find query
postSchema.pre('find', function() {
    // Only include non-expired posts or posts without expiration
    this.where({
        $or: [
            { isExpired: false },
            { expiresAt: { $gt: new Date() } }
        ]
    });
});

export const Post = mongoose.model('Post', postSchema);