// frontend/src/components/CreateStory.jsx
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addStory } from '@/redux/storySlice';

const CreateStory = ({ open, setOpen }) => {
    const fileRef = useRef();
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setPreview(dataUrl);
        }
    };

    const createStoryHandler = async () => {
        if (!file) {
            toast.error('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append("media", file);

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/story/create', 
                formData, 
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );
            
            if (res.data.success) {
                dispatch(addStory(res.data.story));
                toast.success(res.data.message);
                setOpen(false);
                setFile("");
                setPreview("");
            }
        } catch (error) {
            console.error('Story creation error:', error);
            toast.error(error.response?.data?.message || 'Error creating story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md w-full"> {/* Reduced max width */}
                <DialogHeader>
                    <DialogTitle>Create New Story</DialogTitle>
                </DialogHeader>

                {preview ? (
                    <div className='w-full h-[200px] flex items-center justify-center'> {/* Fixed height */}
                        <img 
                            src={preview} 
                            alt="preview" 
                            className='max-h-full w-auto object-contain rounded-md'
                        />
                    </div>
                ) : (
                    <div 
                        className='w-full h-[400px] border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer rounded-md' /* Fixed height */
                        onClick={() => fileRef.current.click()}
                    >
                        <span className='text-gray-500'>Click to select media</span>
                    </div>
                )}

                <input 
                    ref={fileRef} 
                    type='file' 
                    accept="image/*"
                    className='hidden' 
                    onChange={fileChangeHandler}
                />

                {file && (
                    loading ? (
                        <Button disabled className="w-full">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Uploading...
                        </Button>
                    ) : (
                        <Button 
                            onClick={createStoryHandler} 
                            className="w-full"
                        >
                            Share Story
                        </Button>
                    )
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateStory;