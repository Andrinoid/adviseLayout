import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  height: 100%;
  overflow-x: hidden;
  flex-grow: 0;
  width: 320px;
  box-sizing: border-box;
  flex-grow: 0;
`;

const Handle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 100%;
  cursor: col-resize;
  background-color: pink;
  border-left: 1px solid #ccc;
`;

function ResizableContainer({
    children,
    initialWidth = 320,
    minWidth = 0,
    maxWidth = Infinity,
}) {
    const containerRef = useRef(null);
    const handleRef = useRef(null);

    const [w, setW] = useState(initialWidth);
    const [x, setX] = useState(0);
    const [newWidth, setNewWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState(false);

    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [x, w]);

    const mouseDownHandler = (e) => {
        setIsResizing(true);
        // capture the initial x position on drag start
        setX(e.clientX);
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
            } else {
                newWidth = minWidth;
            }
        } else if (newWidth > maxWidth) {
            newWidth = maxWidth;
        }

        setNewWidth(newWidth);
    };

    const mouseUpHandler = () => {
        // Remove the handlers of `mousemove` and `mouseup` they are set again on the next drag
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        setIsResizing(false);
    };

    return (
        <Container ref={containerRef} style={{ width: newWidth }}>
            {children}
            <Handle
                ref={handleRef}
                onMouseDown={mouseDownHandler} 
                isResizing={isResizing}
            />
        </Container>
    );
}

export default ResizableContainer;
