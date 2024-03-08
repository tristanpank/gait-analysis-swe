import { signOut } from 'firebase/auth';
import React, { useState, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from 'src/firebase/auth';
import { GlobalStateContext } from 'src/components/react/GlobalStateProvider';
import ProfileIcon from './ProfileIcon';

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

    const handleSignOut = async () => {
      signOutUser().then(() => {
        setUser({});
        navigate('/');
      }).catch((error) => {
        console.error(error);
      });
    }

    const headerColor = color ? "bg-gradient-to-tr from-[#37e6ff] to-[#10cbfab6]" : "bg-black border-b"

    return (
        <header className={"z-[10] fixed top-0 w-screen p-0 m-0 border-box " + headerColor}>
            <div className="flex justify-between items-center w-full ">
                <h1 className="px-2 py-4 text-2xl">Gait Analysis</h1>
                <ProfileIcon user={user} setUser={setUser} />
            </div>
        </header>
    )
}
 
export default Header