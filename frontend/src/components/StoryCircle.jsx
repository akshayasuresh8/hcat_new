// frontend/src/components/StoryCircle.jsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';

const StoryCircle = ({ stories, onClick }) => {
    const { user: currentUser } = useSelector(state => state.auth);
    const user = stories.user;
    const hasUnviewedStories = stories.stories.some(story => 
        !story.viewers.some(viewer => viewer.user._id === currentUser._id)
    );

    return (
        <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={onClick}
        >
            <div className={`${hasUnviewedStories ? 'gradient-border' : 'viewed-border'}`}>
                <Avatar className="w-16 h-16 border-2 border-white">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
            <span className="text-xs mt-1">{user.username}</span>
        </div>
    );
};

export default StoryCircle;

// Add these styles to your global CSS file (e.g., index.css or App.css)
/*
.gradient-border {
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    padding: 2px;
    border-radius: 50%;
}

.viewed-border {
    background: #8e8e8e;
    padding: 2px;
    border-radius: 50%;
}
*/