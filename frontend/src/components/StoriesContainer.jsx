import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStories, setViewerOpen, setViewingStories } from '@/redux/storySlice';
import StoryCircle from './StoryCircle';
import CreateStory from './CreateStory';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const StoriesContainer = () => {
    const dispatch = useDispatch();
    const { stories } = useSelector(state => state.story);
    const { user } = useSelector(state => state.auth);
    const [createStoryOpen, setCreateStoryOpen] = React.useState(false);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/story/all', {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setStories(res.data.stories));
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };

        fetchStories();
    }, [dispatch]);

    const handleStoryClick = (userStories) => {
        dispatch(setViewingStories(userStories));
        dispatch(setViewerOpen(true));
    };

    return (
        <div className="w-full max-w-sm mx-auto overflow-x-auto">
            <div className="flex gap-4 p-4">
                {/* Add Story Button */}
                <div 
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => setCreateStoryOpen(true)}
                >
                    <Avatar className="w-16 h-16 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        <span className="text-2xl text-gray-400">+</span>
                    </Avatar>
                    <span className="text-xs mt-1">Add Story</span>
                </div>

                {/* Story Circles */}
                {stories.map((userStories) => (
                    <div 
                        key={userStories.user._id}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleStoryClick(userStories)}
                    >
                        <div className={`gradient-border`}>
                            <Avatar className="w-16 h-16 border-2 border-white">
                                <AvatarImage src={userStories.user.profilePicture} />
                                <AvatarFallback>
                                    {userStories.user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <span className="text-xs mt-1">{userStories.user.username}</span>
                    </div>
                ))}
            </div>

            {/* Create Story Dialog */}
            <CreateStory open={createStoryOpen} setOpen={setCreateStoryOpen} />
        </div>
    );
};

export default StoriesContainer;