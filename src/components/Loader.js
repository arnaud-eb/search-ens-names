import React from "react";
import styled from "@emotion/styled/macro";

const LoaderContainer = styled("article")`
  display: flex;
  justify-content: center;
`;

const Spinner = styled("div")`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid transparent;
  border-color: var(--clr-primary-2) transparent var(--clr-primary-2)
    transparent;
  animation: spinner 1.5s linear infinite;

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <Spinner />
    </LoaderContainer>
  );
};

export default Loader;
