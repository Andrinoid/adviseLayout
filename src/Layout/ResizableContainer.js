import React, { useState, useRef, useEffect, useImperativeHandle, useContext } from "react";
import styled from "styled-components";
import { Context } from './index';

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

    const [open, setOpen] = useState(true);
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
        setOpen((prevOpen) => {
            const newOpen = !prevOpen;
            return newOpen;
        });
    };

    useEffect(() => {
        if (open) {
            setNewWidth(initialWidth);
        } else {
            setNewWidth(0);
        }
    }, [open]);

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
        // calculate how far the mouse has been dragged
        const dx = e.clientX - x;
        let newWidth = w + dx;

        if (newWidth < minWidth) {
            const tension = w + dx - minWidth;
            if (tension < -150) {
                newWidth = 0;
                setOpen(false);
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
        setIsResizing(false);
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
                ref={handleRef}
                onMouseDown={mouseDownHandler}
                isResizing={isResizing}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                hoverActive={hoverActive}
            />
        </Container>
    );
}

export default React.forwardRef(ResizableContainer);
