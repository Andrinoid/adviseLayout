import React, { createContext, useContext, useState } from 'react';

// Create Sidebar Content Context
export const SidebarContentContext = createContext();

// Provider component
export function SidebarContentProvider({ children }) {
    const [sidebarContent, setSidebarContent] = useState(null);

    return (
        <SidebarContentContext.Provider value={{ sidebarContent, setSidebarContent }}>
            {children}
        </SidebarContentContext.Provider>
    );
}


// Hook to use the Sidebar Content Context
export function useSidebarContent() {
    const context = useContext(SidebarContentContext);

    if (context === undefined) {
        throw new Error('useSidebarContent must be used within a SidebarContentProvider');
    }

    return context;
}


export function useSidebar() {
    const context = useContext(SidebarContentContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarContentProvider');
    }

    const { setSidebarContent, sidebarContent } = context;

    function clearContent() {
        setSidebarContent(null);
    }

    return {
        sidebarContent,
        setContent: setSidebarContent,
        clearContent
    };
}
