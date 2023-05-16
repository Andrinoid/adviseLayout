import React, { createContext, useCallback, useContext, useState } from "react";
import { cloneDeep } from "lodash";
import Transition from "./Transition";
// Create Sidebar Content Context
export const SidebarsContext = createContext();

export class Stack {
    data = [];
    drawer = false;
    width = null;

    constructor(component, config) {
        if (config) {
            if (config.drawer) {
                this.drawer = config.drawer;
            }

            if (config.width) {
                this.width = config.width;
            }
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
        isFixed: true,
        resizing: {
            isResizing: false,
            resizingFinished: false,
        },
        popped: false,
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

    if (config.position && config.position == "right") {
        setData({ ...data, atRight: true });
    }

    function setPopped(value) {
        setData({ ...data, popped: value });
    }

    function setResizing({ isResizing, resizingFinished }) {
        setData({
            ...data,
            resizing: { isResizing, resizingFinished },
        });
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

    const setIsFixed = (value) => {
        setData({ ...data, isFixed: value });
    };

    const getSidebars = useCallback(() => {
        return data.sidebars;
    }, [data.sidebars]);

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
        const sidebar = data.sidebars[number - 1];

        if (sidebar) {
            // Update the sidebars to fade out so that it becomes invisible
            sidebar.data = cloneDeep(
                sidebar.data.map((c) => {
                    if (c.type.name == "Transition") {
                        return React.cloneElement(c, { fadeIn: false });
                    }
                    return c;
                })
            );

            // Update the state to reflect the changes
            setData({ ...data, sidebars: cloneDeep(data.sidebars) });

            // Wait for the fade out to complete and then add the content
            // using a fade in transition and then persisting the changes
            // to reflect the addition of the content
            setTimeout(() => {
                sidebar.push(<Transition fadeIn={true}>{content}</Transition>);
                setData({ ...data, sidebars: cloneDeep(data.sidebars) });
            }, 100);
        }
    }

    function addSidebar(config) {
        const { component: content } = config;
        delete config.component;

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
        const sidebar = data.sidebars[number - 1];

        if (sidebar) {
            // Update the sidebars to fade in again so that it becomes visible
            sidebar.data = cloneDeep(
                sidebar.data.map((c) => {
                    if (c.type.name == "Transition") {
                        return React.cloneElement(c, { fadeIn: true });
                    }
                    return c;
                })
            );

            // Update the state to reflect the changes
            setData({ ...data, sidebars: cloneDeep(data.sidebars) });

            // Wait for the fade in to complete and then remove the sidebar
            // using a fade out transition and then persisting the changes
            // to reflect the removal of the sidebar
            setTimeout(() => {
                if (sidebar.length() >= 1) {
                    sidebar.data[sidebar.length() - 1] = React.cloneElement(
                        sidebar.data[sidebar.data.length - 1],
                        { fadeIn: false }
                    );

                    setData({ ...data, sidebars: cloneDeep(data.sidebars) });
                }

                setTimeout(() => {
                    sidebar.pop();
                    setData({ ...data, sidebars: cloneDeep(data.sidebars) });
                }, 50);
            }, 50);
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
            popped: true,
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

        const length = getSidebar(i + 1).length();

        if (length > 0) {
            popSidebar(i + 1);

            const amount = getIsAtRight() ? i + 1 : all.length - i;
            const from = length == 1 && i != 0 ? 0 : 1;
            for (let y = from; y < amount; y++) {
                popStack();
            }
        }
    }

    return {
        data,
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
        setIsFixed,
        setResizing,
        setPopped,
    };
}
