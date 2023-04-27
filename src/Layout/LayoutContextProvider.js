import React, { useState, useEffect } from 'react';

export const Context = React.createContext();

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const LayoutContextProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    };

    const debouncedHandleResize = debounce(handleResize, 100);

    useEffect(() => {
        window.addEventListener("resize", debouncedHandleResize);
        return () => {
            window.removeEventListener("resize", debouncedHandleResize);
        }
    }, []);

    return (
        <Context.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
            {children}
        </Context.Provider>
    );
};

export default LayoutContextProvider;
