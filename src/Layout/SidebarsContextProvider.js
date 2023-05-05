import React, { createContext, useContext, useState } from "react";

// Create Sidebar Content Context
export const SidebarsContext = createContext();

export class Sidebar {
    content = [];

    constructor(content) {
        if (content) {
            this.content.push(content);
        }
    }

    top() {
        return this.content[this.content.length - 1];
    }

    push(content) {
        this.content.push(content);
    }

    pop() {
        return this.content.pop();
    }

    length() {
        return this.content.length;
    }
}

// Provider component
export function SidebarsProvider({ children }) {
    const [sidebars, setSidebars] = useState([new Sidebar()]);

    return (
        <SidebarsContext.Provider value={{ sidebars, setSidebars }}>
            {children}
        </SidebarsContext.Provider>
    );
}

export function useControls() {
    const context = useContext(SidebarsContext);
    if (context === undefined) {
        throw new Error(
            "useSidebar must be used within a SidebarContentProvider"
        );
    }

    const { sidebars, setSidebars } = context;

    function getSidebar(number = 1) {
        if (!number || number < 1 || number > sidebars.length)
            throw new Error("Sidebar number out of range");

        return sidebars[number - 1];
    }

    function addToSidebar(content, number = 1) {
        if (!number || number < 1 || number > sidebars.length)
            throw new Error("Sidebar number out of range");

        sidebars[number - 1].push(content);
        setSidebars(Object.assign([], sidebars));
    }

    function addSidebar(content) {
        sidebars.push(new Sidebar(content));
        setSidebars(Object.assign([], sidebars));
    }

    function getSidebars() {
        return sidebars;
    }

    function popSidebar(number) {
        if (!number || number < 1 || number > sidebars.length)
            throw new Error("Sidebar number out of range");

        sidebars[number - 1].pop();
        setSidebars(Object.assign([], sidebars));
    }

    function length() {
        return sidebars.length;
    }

    return {
        getSidebars,
        getSidebar,
        addToSidebar,
        clearContent,
        addSidebar,
        popSidebar,
        length
    };
}
