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
    initialwidth = 320,
}) {
    //elements
    const containerRef = useRef(null);
    const handleRef = useRef(null);

    const [w, setW] = useState(initialwidth);
    const [x, setX] = useState(0);
    const [newWidth, setNewWidth] = useState(initialwidth);
    const [position, setPosition] = useState(0);
    const [isResizing, setIsResizing] = useState(false);

    // This is a hack to only run the effect once
    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        // Attach the listeners to `document`
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        return () => {
            // Remove the listeners from `document`
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [x, w]);

    const mouseDownHandler = (e) => {
        setIsResizing(true);
        // Get the current mouse position
        setX(e.clientX);
        // Get current width of the column
        setW(containerRef.current.offsetWidth);
    };

    const mouseMoveHandler = (e) => {
        if (!isResizing) return;
        // How far the mouse has been moved
        let dx = e.clientX - x;
        let newWidth = w + dx;

        setNewWidth(newWidth);
    };

    const mouseUpHandler = () => {
        // Remove the handlers of `mousemove` and `mouseup`
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
