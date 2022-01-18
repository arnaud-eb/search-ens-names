import React from "react";
import styled from "@emotion/styled/macro";

import { ErrorType } from "../FormComponent";

interface MessagePropsType {
  alert: ErrorType;
}

interface MessageContainerPropsType {
  type: string;
}

const MessageContainer = styled("article")`
  border-radius: var(--radius);
  padding: 5px 10px;
  overflow-wrap: break-word;
  ${(p: MessageContainerPropsType) =>
    p.type === "success" &&
    `
    background-color: var(--clr-green-dark)
  `}
  ${(p: MessageContainerPropsType) =>
    p.type === "error" &&
    `
    background-color: var(--clr-red-dark)
  `};
`;

const Message = ({ alert }: MessagePropsType) => {
  console.log(alert);
  return (
    <MessageContainer type={alert.type}>
      <p>{alert.msg}</p>
    </MessageContainer>
  );
};

export default Message;
