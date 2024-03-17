import React, { useState, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from 'src/firebase/auth';
import ProfileIcon from './ProfileIcon';
import { Input } from "../../../shadcn/components/ui/input";
import { Label } from "../../../shadcn/components/ui/label";
import { setUserPFP, setUserHeight, getUserHeight, setUserDisplayName} from "../../../firebase/db";
import { Button } from '../../../shadcn/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../../../shadcn/components/ui/dropdown-menu";
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
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "../../../shadcn/components/ui/navigation-menu"

const Header = (props) => {
    const { user, setUser, color } = props
    const navigate = useNavigate();
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [isEditingHeight, setIsEditingHeight] = useState(false);
    const [inputHeightFeet, setInputHeightFeet] = useState(null);
    const [inputHeightInches, setInputHeightInches] = useState(null);
    const [height, setHeight] = useState(null);
    const [update, setUpdate] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [inputName, setInputName] = useState(null);
    const [name, setName] = useState(null);


    useEffect(() => {
        if (user) {
            getUserHeight(user).then((height) => {
                setHeight(height);
                setName(user.displayName);
            });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            getUserHeight(user).then((height) => {
                setHeight(height);
                setInputHeightFeet(Math.floor(height / 12));
                setInputHeightInches(height % 12);
            });
            setInputName(user.displayName);
            setIsEditingName(false);
            setIsEditingHeight(false);
        }
    }, [user, update]);


    const handleSignOut = async () => {
        signOutUser().then(() => {
            setUser({});
            navigate('/');
        }).catch((error) => {
            console.error(error);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById("image");
        const file = fileInput.files[0];

        if (file) {
            try {
                if (user.uid !== undefined) {
                    await setUserPFP(user, file);
                    setUploadError(false);
                    setUploadSuccess(true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } else {
                    console.error("User not logged in");
                    setUploadSuccess(false);
                    setUploadError(true);
                }

            } catch(error){console.log(error)}}
                
        else {
        console.error("No file selected");
        setUploadSuccess(false);
        setUploadError(true);
        }
    }

    const headerColor = color ? "bg-gradient-to-tr text-white from-[#37e6ff] to-[#10cbfab6]" : "bg-white text-black border-b"

    return (
        <header data-testid="Header" className={"flex z-[10] fixed top-0 w-screen p-0 m-0 border-box " + headerColor}>
            <div className="flex items-center w-full ">
                <h1 className="px-2 py-4 mr-5 font-semibold text-2xl">Gait Analysis</h1>
                { user && user.uid &&
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href='/dashboard' className='mr-5 font-semibold hover:text-blue-600'>Dashboard</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href='/upload' className="mr-5 font-semibold hover:text-blue-600">Upload Video</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu> }
            </div>
            {user && 
            <div className="flex mr-5">
                <Sheet>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <ProfileIcon user={user} setUser={setUser} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
                                <DropdownMenuItem>
                                    <SheetTrigger>
                                        <button onClick={()=>setUpdate((prev)=>!prev)} >Settings</button>
                                    </SheetTrigger>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                <button onClick={handleSignOut} >Sign Out</button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                    <SheetContent handleClose={() => setUpdate((prev) => !prev)}>
                        <SheetHeader>
                            <SheetTitle>Settings</SheetTitle>
                            <SheetDescription>
                                <div className='mt-5'>
                                    <div className="flex text-black mb-2">
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
                                                                <Input type="file" id="image" accept="image/*" className="cursor-pointer" />
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
                                <div className="text-black mb-2">
                                    {isEditingName ? (
                                        <form className="flex" onSubmit={(e) => {
                                            e.preventDefault();
                                            setUserDisplayName(user, inputName);
                                            setName(inputName);
                                            // Here you can handle the form submission, e.g., update the height in your database
                                            setIsEditingName(false);
                                        }}>
                                            <span>Name: </span>
                                            <input 
                                                className='w-25 mx-2'
                                                type="text" 
                                                pattern="[A-Za-z ]*"
                                                autofocus required title="Only alphabetic characters and spaces are allowed."
                                                maxLength="50"
                                                value={inputName} 
                                                onChange={(e) => setInputName(e.target.value)} 
                                            />
                                            <button className="mx-2" type="submit">Save</button>
                                        </form>
                                    ) : (
                                        <button onClick={() => setIsEditingName(true)} className="flex">
                                            <div className='mr-3'>Name: {name}</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/></svg>
                                        </button>
                                    )}
                                </div>
                                <div className="text-black mb-2">
                                    {isEditingHeight ? (
                                        <form className="flex" onSubmit={(e) => {
                                            e.preventDefault();
                                            setUserHeight(user, inputHeightFeet * 12 + inputHeightInches);
                                            setHeight(inputHeightFeet * 12 + inputHeightInches);
                                            // Here you can handle the form submission, e.g., update the height in your database
                                            setIsEditingHeight(false);
                                        }}>
                                            <span>Height: </span>
                                            <input 
                                                className='w-10 mx-2'
                                                type="number" 
                                                max="9"
                                                min="0"
                                                value={inputHeightFeet} 
                                                onChange={(e) => setInputHeightFeet(parseInt(e.target.value))} 
                                            />
                                            <span>ft.</span>
                                            <input 
                                                className='w-10 mx-2'
                                                type="number" 
                                                max="11"
                                                min="0"
                                                value={inputHeightInches} 
                                                onChange={(e) => setInputHeightInches(parseInt(e.target.value))} 
                                            />
                                            <span>in.</span>
                                            <button className="mx-2" type="submit">Save</button>
                                        </form>
                                        
                                    ) : (
                                        <button onClick={() => setIsEditingHeight(true)} className="flex">
                                            <div className='mr-3'>Height: {height ? (`${Math.floor(height / 12)} ft. ${height % 12} in.`) : ("Click to add your height")}</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/></svg>
                                        </button>
                                    )}
                                </div>
                                <div className="flex text-black mb-2">
                                    <svg className="mr-2 mt-1" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.05005 13.5C2.05005 13.7485 2.25152 13.95 2.50005 13.95C2.74858 13.95 2.95005 13.7485 2.95005 13.5L2.95005 1.49995C2.95005 1.25142 2.74858 1.04995 2.50005 1.04995C2.25152 1.04995 2.05005 1.25142 2.05005 1.49995L2.05005 13.5ZM8.4317 11.0681C8.60743 11.2439 8.89236 11.2439 9.06809 11.0681C9.24383 10.8924 9.24383 10.6075 9.06809 10.4317L6.58629 7.94993L14.5 7.94993C14.7485 7.94993 14.95 7.74846 14.95 7.49993C14.95 7.2514 14.7485 7.04993 14.5 7.04993L6.58629 7.04993L9.06809 4.56813C9.24383 4.39239 9.24383 4.10746 9.06809 3.93173C8.89236 3.75599 8.60743 3.75599 8.4317 3.93173L5.1817 7.18173C5.00596 7.35746 5.00596 7.64239 5.1817 7.81812L8.4317 11.0681Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                    <button onClick={handleSignOut}>Sign Out</button>
                                </div>                              
                        </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            }
        </header>
    )
}

export default Header