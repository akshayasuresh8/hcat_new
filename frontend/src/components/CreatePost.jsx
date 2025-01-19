import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, Timer } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [duration, setDuration] = useState("permanent");// New state for post duration
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const {posts} = useSelector(store=>store.post);
    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }

    const createPostHandler = async (e) => {
        //Newly added for 24hrs 
        const allowedDurations = ["permanent", "4", "8", "12", "24"];
        if (!allowedDurations.includes(duration)) {
            toast.error("Invalid duration. Please select a valid duration.");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        if (duration !== "permanent") formData.append("duration", duration);
        if (imagePreview) formData.append("image", file);

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="img" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-gray-600 text-xs'>Bio here...</span>
                    </div>
                </div>
                
                <Textarea 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)} 
                    className="focus-visible:ring-transparent border-none" 
                    placeholder="Write a caption..." 
                />

                {/* Duration Selector */}
                <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <Select 
                        value={duration} 
                        onValueChange={setDuration}
                        defaultValue="permanent"
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Post duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="permanent">No expiration</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                            <SelectItem value="8">8 hours</SelectItem>
                            <SelectItem value="12">12 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {imagePreview && (
                    <div className='w-full h-64 flex items-center justify-center'>
                        <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                    </div>
                )}

                <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
                
                <Button 
                    onClick={() => imageRef.current.click()} 
                    className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'
                >
                    Select from computer
                </Button>

                {imagePreview && (
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
                    )
                )}
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost