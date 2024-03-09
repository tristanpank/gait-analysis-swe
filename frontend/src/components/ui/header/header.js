import { signOut } from 'firebase/auth';
import React, { useState, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from 'src/firebase/auth';
import { GlobalStateContext } from 'src/components/react/GlobalStateProvider';
import ProfileIcon from './ProfileIcon';
import { Button } from '../../../shadcn/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../../shadcn/components/ui/sheet"

const Header = (props) => {
    const { user, setUser, color } = props
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

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
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

            </div>
        </header>
    )
}
 
export default Header