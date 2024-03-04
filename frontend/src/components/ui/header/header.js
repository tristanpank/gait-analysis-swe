import React, { useState, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
    const { user } = props
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
        <header className={isActive ? "z-[10] fixed top-0 w-full border-b backdrop-blur-sm bg-white/[0.6] dark:bg-black/[0.6] border-neutral-200 dark:border-white/[0.1]" : "z-[10] fixed top-0 w-full bg-transparent border-b border-transparent"}>
            <div className="container flex h-16">
                <h1 className="px-3 py-5">Header</h1>
            </div>
        </header>
    )
}
 
export default Header