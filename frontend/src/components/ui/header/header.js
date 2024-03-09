import { signOut } from 'firebase/auth';
import React, { useState, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from 'src/firebase/auth';
import { GlobalStateContext } from 'src/components/react/GlobalStateProvider';
import ProfileIcon from './ProfileIcon';
import { Input } from "../../../shadcn/components/ui/input";
import { Label } from "../../../shadcn/components/ui/label";
import { setUserPFP } from "../../../firebase/db";
import { Button } from '../../../shadcn/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../../shadcn/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../shadcn/components/ui/dialog"

const Header = (props) => {
    const { user, setUser, color } = props
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById("image");
        const file = fileInput.files[0];

        if (file) {
        try {
            await setUserPFP(user, file);
            setUploadError(false);
            setUploadSuccess(true);
        } catch (error) {
            console.error(error);
            setUploadSuccess(false);
            setUploadError(true);
        }
        } else {
            console.error("No file selected");
            setUploadSuccess(false);
            setUploadError(true);
        }
    }

    // Effect hook to add and remove the scroll event listener
    useEffect(() => {
        const handleScroll = () => {
        // Check the scroll position and set isActive accordingly
        // For example, toggle isActive when scroll position is more than 100px
        if (window.scrollY > 10) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
        };

        // Add the scroll event listener when the component mounts
        window.addEventListener('scroll', handleScroll);

        // Clean up function to remove the scroll event listener when the component unmounts
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

    const headerColor = color ? "bg-gradient-to-tr text-white from-[#37e6ff] to-[#10cbfab6]" : "bg-white text-black border-b"

    return (
        <header className={"flex z-[10] fixed top-0 w-screen p-0 m-0 border-box " + headerColor}>
            <div className="flex justify-between items-center w-full ">
                <h1 className="px-2 py-4 font-semibold text-2xl">Gait Analysis</h1>
                <ProfileIcon user={user} setUser={setUser} />
            </div>
            <div className="flex mr-5">
                <Sheet>
                    <SheetTrigger>
                        <Button size="icon">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                        <SheetTitle>Settings</SheetTitle>
                        <SheetDescription>
                            <div className='mt-5'>
                                <div className="flex text-black">
                                    <svg className="mr-2 mt-1" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                        <Dialog>
                                            <button className="p-[3px] relative">
                                                <DialogTrigger>Add Profile Picture</DialogTrigger>
                                            </button>
                                            <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Upload Profile Picture</DialogTitle>
                                                <DialogDescription>
                                                <form onSubmit={handleSubmit} className="">
                                                    <div className="mt-5 mb-5 block">
                                                    <Label htmlFor="image" className="mb-2 block">Upload an image:</Label>
                                                    <Input type="file" id="image" className="cursor-pointer" />
                                                    </div>
                                                    <div>
                                                    {uploadSuccess && 
                                                        <div className="mb-5 text-green-500">Upload successful!</div>
                                                    }
                                                    {uploadError && 
                                                        <div className="mb-5 text-red-500">Upload failed. Please try again.</div>
                                                    }
                                                    </div>
                                                    <Button type="submit" variant="default">Submit</Button>
                                                </form>
                                                </DialogDescription>
                                            </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                </div>
                            </div>
                        </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

            </div>
        </header>
    )
}
 
export default Header