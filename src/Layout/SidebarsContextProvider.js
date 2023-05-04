import React, { createContext, useContext, useState } from 'react';

// Create Sidebar Content Context
export const SidebarsContext = createContext();

class Sidebar {
    content = null
}

// Provider component
export function SidebarsProvider({ children }) {
    const [sidebars, setSidebars] = useState([new Sidebar(), new Sidebar()]);

    return (
        <SidebarsContext.Provider value={{ sidebars, setSidebars }}>
            {children}
        </SidebarsContext.Provider>
    );
}


export function useControls() {
    const context = useContext(SidebarsContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarContentProvider');
    }

    const { sidebars, setSidebars } = context;

    function clearContent() {
        setSidebars(sidebars.map(sidebar => {
            sidebar.content = null;

            return {...sidebar};
        }));
    }

    function getSidebar(number = 1) {
        if (!number || number < 1 || number > sidebars.length)
            throw new Error('Sidebar number out of range');
        
        return sidebars[number-1].content;
    }

    function setSidebar(content, number = 1) {
        if (!number || number < 1 || number > sidebars.length)
            throw new Error('Sidebar number out of range');
        
        sidebars[number-1].content = content;
        setSidebars([...sidebars]);
    }

    function getSidebars() {
        return sidebars;
    }

    return {
        getSidebars,
        getSidebar,
        setSidebar,
        clearContent
    };
}
