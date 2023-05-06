import React, { createContext, useContext, useState } from "react";

// Create Sidebar Content Context
export const SidebarsContext = createContext();

export class Stack {
    data = [];
    drawer = false;

    constructor(component) {
        if (component.drawer !== undefined) {
            this.drawer = component.drawer;
        } else {
            if (component) {
                this.data.push(component);
            }
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
    const [sidebars, setSidebars] = useState([new Stack({ drawer: false }), new Stack({ drawer: true }), new Stack({ drawer: true })]);

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

    const getSidebar = function (number = 1) {
        if (number > 0 && number <= sidebars.length) {
            return sidebars[number - 1];
        }

        return null;
    };

    function getSidebars() {
        return sidebars;
    }

    function addToSidebar(content, number = 1) {
        if (sidebars[number - 1]) {
            sidebars[number - 1].push(content);

            setSidebars(Object.assign([], sidebars));
        }
    }

    function addSidebar(content) {
        sidebars.push(new Stack(content));

        setSidebars(Object.assign([], sidebars));
    }

    function popSidebar(number) {
        if (sidebars[number - 1]) {
            sidebars[number - 1].pop();
            setSidebars(Object.assign([], sidebars));
        }
    }

    function length() {
        return sidebars.length;
    }

    function popStack() {
        sidebars.pop();
        setSidebars(Object.assign([], sidebars));
    }

    function popStacks() {
        const length = sidebars.length;

        for (let i = 0; i < length; i++) {
            sidebars.pop();
        }

        setSidebars(Object.assign([], sidebars));
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
