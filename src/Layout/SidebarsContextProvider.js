import React, { createContext, useCallback, useContext, useState } from "react";

// Create Sidebar Content Context
export const SidebarsContext = createContext();

export class Stack {
    data = [];
    drawer = false;

    constructor(component, config) {
        if (config && config.drawer) {
            this.drawer = config.drawer;
        }

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
    const [data, setData] = useState({
        sidebars: [],
        header: { shouldCollapse: true, isCollapsed: false },
        atRight: false,
    });

    return (
        <SidebarsContext.Provider value={{ data, setData }}>
            {children}
        </SidebarsContext.Provider>
    );
}

export function useControls(config = {}) {
    const context = useContext(SidebarsContext);
    if (context === undefined) {
        throw new Error(
            "useSidebar must be used within a SidebarContentProvider"
        );
    }

    const { data, setData } = context;

    if (config.position && config.position == 'right') {
        setData({ ...data, atRight: true });
    }

    const getSidebar = function (number = 1) {
        if (number > 0 && number <= data.sidebars.length) {
            return data.sidebars[number - 1];
        }

        return null;
    };

    const setAtRight = (value) => {
        setData({ ...data, atRight: value });
    };

    const getIsAtRight = () => {
        return data.atRight;
    };

    const getSidebars = () => {
        return data.sidebars;
    };

    const getHeader = () => {
        return data.header;
    };

    function setShouldCollapse(shouldCollapse) {
        setData({ ...data, header: { ...data.header, shouldCollapse } });
    }

    function toggleCollapsed() {
        const result = {
            ...data,
            header: { ...data.header, isCollapsed: !data.header.isCollapsed },
        };

        setData(result);
    }

    function addToSidebar(content, number = 1) {
        if (data.sidebars[number - 1]) {
            data.sidebars[number - 1].push(content);

            setData({ ...data, sidebars: Object.assign([], data.sidebars) });
        }
    }

    function addSidebar(content, config) {
        if (data.header.shouldCollapse && data.header.isCollapsed) return;

        if (data.atRight) {
            data.sidebars.unshift(new Stack(content, config));
        } else {
            data.sidebars.push(new Stack(content, config));
        }

        if (data.header.shouldCollapse) {
            const isCollapsed =
                data.header.isCollapsed && data.sidebars.length == 1
                    ? false
                    : data.header.isCollapsed && data.sidebars.length > 0
                    ? true
                    : false;
            setData({
                ...data,
                sidebars: Object.assign([], data.sidebars),
                header: { ...data.header, isCollapsed },
            });
        } else {
            setData({ ...data, sidebars: Object.assign([], data.sidebars) });
        }
    }

    function popSidebar(number) {
        if (data.sidebars[number - 1]) {
            data.sidebars[number - 1].pop();
            setData({ ...data, sidebars: Object.assign([], data.sidebars) });
        }
    }

    function length() {
        return data.sidebars.length;
    }

    function popStack() {
        if (data.header.shouldCollapse && data.header.isCollapsed) return;

        if (data.atRight) {
            data.sidebars.shift();
        } else {
            data.sidebars.pop();
        }
        setData({
            ...data,
            sidebars: data.sidebars.map((s) => Object.assign(new Stack(), s)),
        });
    }

    const popStacks = (type = null) => {
        if (data.header.shouldCollapse && data.header.isCollapsed) return;

        const length = data.sidebars.length;

        for (let i = 0; i < length; i++) {
            const sidebar = data.sidebars[data.sidebars.length - 1];

            if (type == "drawer" && !sidebar.drawer) {
                continue;
            }

            if (type == "sidebar" && sidebar.drawer) {
                continue;
            }

            data.sidebars.pop();
        }
    };

    function popStackFrom(sidebar) {
        const all = getSidebars();
        const i = all.findIndex((s) => s === sidebar);

        const length = getSidebar(i + 1).length()

        if (length > 0) {
            popSidebar(i + 1);
        } else {
            const amount = getIsAtRight() ? i + 1 : all.length - i;

            for (let y = 0; y < amount; y++) {
                popStack();
            }
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
        getHeader,
        setShouldCollapse,
        toggleCollapsed,
        getIsAtRight,
        popStackFrom,
        setAtRight,
    };
}
