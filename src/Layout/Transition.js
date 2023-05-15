import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Component = styled.div`
    animation: ${(props) =>
        props.fadeIn
            ? css`
                  ${fadeIn} 0.25s ease-in forwards
              `
            : props.fadeOut
            ? css`
                  ${fadeOut} 0.25s ease-out forwards
              `
            : "none"};
`;

export default function Transition(props) {
    return <Component {...props} />;
}
