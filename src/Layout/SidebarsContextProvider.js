import React, { createContext, useContext, useState } from "react";

// Create Sidebar Content Context
export const SidebarsContext = createContext();

export class Stack {
    data = [];

    constructor(component) {
        if (component) {
            this.data.push(component);
        }
    }

    top() {
        return this.data[this.length() - 1];
    }

    push(content) {
        this.data.push(content);
    }

    pop() {
        return this.data.pop();
    }

    length() {
        return this.data.length;
    }
}

// Provider component
export function SidebarsProvider({ children }) {
    const [sidebars, setSidebars] = useState([new Stack()]);

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
        if (number > 0 && number <= sidebars.length) {
            return sidebars[number - 1];
        }

        return null;
    }

    function getSidebars() {
        return sidebars;
    }

    function addToSidebar(content, number = 1) {
        if (number > 0 && number <= sidebars.length) {
            sidebars[number - 1].push(content);

            setSidebars(Object.assign([], sidebars));
        }
    }

    function addSidebar(content) {
        sidebars.push(new Stack(content));

        setSidebars(Object.assign([], sidebars));
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

    function popStack() {
        if (sidebars.length > 1) {
            sidebars.pop();
            setSidebars(Object.assign([], sidebars));
        }
    }

    function popStacks() {
        if (sidebars.length > 1) {
            for (let i = 0; i < sidebars.length; i++) {
                sidebars.pop();
            }

            setSidebars(Object.assign([], sidebars));
        }
    }

    return {
        getSidebar,
        getSidebars,
        addToSidebar,
        addSidebar,
        popSidebar,
        length,
        popStack,
        popStacks,
    };
}
