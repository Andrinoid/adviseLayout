import React, { useState, useEffect} from "react";
import styled from "styled-components";

import { ResizableContainer } from "./ResizableContainer";

const Drawer = (
    {
        children,
        initialWidth = 320,
        minWidth = 0,
        maxWidth = Infinity,
        className,
        index,
    },
    ref
) => {
    const [data, setData] = useState({
        mainHeight: 0,
        headerHeight: 0,
    });

    useEffect(() => {
        const main = document.querySelector("main");
        const header = document.querySelector("header");

        setData({
            mainHeight: main.offsetHeight,
            headerHeight: header.offsetHeight,
        });
    }, []);

    return (
        <Content
            id="content"
            index={index}
            top={data.headerHeight}
            // left={left}
            width={initialWidth}
            maxWidth={maxWidth}
            height={data.mainHeight}
        >
            <ResizableContainer
                drawer={true}
                initialWidth={initialWidth}
                minWidth={minWidth}
                maxWidth={maxWidth}
                ref={ref}
                className={className}
            >
                {children}
            </ResizableContainer>
        </Content>
    );
};

export default React.forwardRef(Drawer);

const Content = styled.div`
    position: absolute;
    right: ${({ width, index }) => -(width * index)}px;
    width: ${({ width }) => width}px;
    height: 100%;
    box-sizing: border-box;
`;

Content.defaultProps = {
    top: 0,
    left: 0,
    height: "100%",
    width: "auto",
};
