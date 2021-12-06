import React from "react";
import styled from "@emotion/styled/macro";
import makeBlockie from "ethereum-blockies-base64";

import { truncateAddress } from "../utils/utils";

import Loader from "./Loader";

const RecordsContainer = styled("article")`
  display: grid;
  align-items: center;
  column-gap: 1rem;
  @media (min-width: 1200px) {
    grid-template-columns: auto 1fr;
  }
`;
const Avatar = styled("img")`
  display: none;
  width: 75px;
  height: 75px;
  border-radius: 50%;
  @media (min-width: 1200px) {
    display: block;
  }
`;
const ENSName = styled("h1")`
  margin-bottom: 0.25rem;
`;
const Address = styled("h2")``;

const Records = ({ loading, records }) => {
  if (loading) {
    return <Loader />;
  }
  return (
    <RecordsContainer>
      {Object.values(records).some((record) => !!record) && (
        <>
          <Avatar
            src={records.avatar || makeBlockie(records.address)}
            alt={records.name || "blocky identicon"}
          />
          <div>
            {records.name && <ENSName>{records.name}</ENSName>}
            <Address>{truncateAddress(records.address)}</Address>
          </div>
        </>
      )}
    </RecordsContainer>
  );
};

export default Records;
