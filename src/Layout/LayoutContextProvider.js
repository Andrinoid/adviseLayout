import React, { useState } from 'react';

export const Context = React.createContext();

const LayoutContextProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <Context.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
            {children}
        </Context.Provider>
    );
};

export default LayoutContextProvider;
