import React, { useState, useRef, useEffect, useImperativeHandle, useContext } from "react";
import styled from "styled-components";
import { Context } from "./LayoutContextProvider";

const Container = styled.div`
  position: relative;
  height: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  flex-grow: 0;
  user-select: none;
`;
const Handle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 7px;
  height: 100%;
  cursor: col-resize;
  background-color: ${({ hoverActive, isResizing }) => (hoverActive || isResizing ? "rgb(232, 232, 232)" : "transparent")};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgb(232, 232, 232);
    transition: background-color 0.5s ease;
    transition-delay: 0.5s;
  }
`;

function ResizableContainer({
    children,
    initialWidth = 320,
    minWidth = 0,
    maxWidth = Infinity,
    className,
},
    ref) {

    const { isSidebarOpen, setIsSidebarOpen } = useContext(Context);
    const containerRef = useRef(null);
    const handleRef = useRef(null);
    const prevClientXRef = useRef(null);

    const [w, setW] = useState(initialWidth);
    const [x, setX] = useState(0);
    const [newWidth, setNewWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState(false);

    const [hoverActive, setHoverActive] = useState(false);
    const hoverTimeout = useRef(null);

    const handleMouseEnter = () => {
        hoverTimeout.current = setTimeout(() => {
            setHoverActive(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeout.current);
        setHoverActive(false);
    };

    useImperativeHandle(ref, () => ({
        toggle() {
            toggleOpen();
        }
    }));

    const toggleOpen = () => {
        setIsSidebarOpen((prevOpen) => {
            const newOpen = !prevOpen;
            return newOpen;
        });
    };

    useEffect(() => {
        if (isSidebarOpen) {
            setNewWidth(initialWidth);
        } else {
            setNewWidth(0);
        }
    }, [isSidebarOpen]);

    const mouseDownHandler = (e) => {
        const { clientX } = e;
        setIsResizing(true);
        // capture the initial x position on drag start
        setX(clientX);
        // capture the initial container width on drag start
        setW(containerRef.current.offsetWidth);
    };

    const mouseMoveHandler = (e) => {
        if (!isResizing) return;

        // If the previous clientX position is null, assign the current clientX position
        if (prevClientXRef.current === null) {
            prevClientXRef.current = e.clientX;
            return;
        }

        // calculate how far the mouse has been dragged
        const dx = e.clientX - x;
        let newWidth = w + dx;

        // Detect drag direction
        const dragDirection = e.clientX - prevClientXRef.current; // Positive if dragging right, negative if dragging left
        prevClientXRef.current = e.clientX;

        // if (dragDirection < 0) {
        //     console.log('dragging left');
        // } else if (dragDirection > 0) {
        //     console.log('dragging right');
        // }

        // console.log('is sidebar open', isSidebarOpen);
        // console.log('dx', dx);
        // console.log('newWidth', newWidth);
        // console.log('tenstion', w + dx - minWidth);

        if (newWidth < minWidth) {
            const tension = w + dx - minWidth;
            if (tension < -150) {
                newWidth = 0;
                setIsSidebarOpen(false);
            } else {
                newWidth = minWidth;
            }
        } else if (newWidth > maxWidth) {
            newWidth = maxWidth;
        }
        setNewWidth(newWidth);
    };

    const mouseUpHandler = () => {
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        prevClientXRef.current = null;
        setIsResizing(false);
    };

    const handleDoubleClick = () => {
        setNewWidth(initialWidth);
    };

    useEffect(() => {
        if (!isResizing) return;
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [isResizing]);

    return (
        <Container className={className} ref={containerRef} style={{ width: newWidth }}>
            {children}
            <Handle
                onMouseDown={mouseDownHandler}
                isResizing={isResizing}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onDoubleClick={handleDoubleClick}
                hoverActive={hoverActive}
                ref={handleRef}
            />
        </Container>
    );
}

export default React.forwardRef(ResizableContainer);
