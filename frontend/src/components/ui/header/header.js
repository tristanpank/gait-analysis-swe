import React, { useState, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
    const { user, color } = props
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

    return (
        <header className={color ? "z-[10] fixed w-[100vw] top-0 bg-gradient-to-tr from-[#37e6ff] to-[#10cbfab6]" : "z-[10] fixed top-0 w-[100vw] bg-black border-b"}>
            <div className="container flex">
                <h1 className="px-2 py-4 text-2xl">Header</h1>
            </div>
        </header>
    )
}
 
export default Header