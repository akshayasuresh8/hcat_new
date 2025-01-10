// frontend/src/redux/storySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stories: [],
    activeStoryIndex: 0,
    isViewerOpen: false,
    currentUserStories: [],
    viewingStories: null
};

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        setStories: (state, action) => {
            state.stories = action.payload;
        },
        addStory: (state, action) => {
            state.currentUserStories = [...state.currentUserStories, action.payload];
        },
        setActiveStoryIndex: (state, action) => {
            state.activeStoryIndex = action.payload;
        },
        setViewerOpen: (state, action) => {
            state.isViewerOpen = action.payload;
        },
        setViewingStories: (state, action) => {
            state.viewingStories = action.payload;
        },
        removeExpiredStories: (state) => {
            const now = new Date();
            state.stories = state.stories.filter(story => {
                return new Date(story.expiresAt) > now;
            });
        }
    }
});

export const { 
    setStories, 
    addStory, 
    setActiveStoryIndex, 
    setViewerOpen,
    setViewingStories,
    removeExpiredStories 
} = storySlice.actions;
export default storySlice.reducer;