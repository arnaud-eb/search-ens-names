import React, { useState } from "react";
import styled from "@emotion/styled/macro";

const SearchFormContainer = styled("article")``;
const Form = styled("form")`
  position: relative;
  display: grid;
  grid-gap: 10px;
  font-weight: 200;
  @media (min-width: 1200px) {
    grid-template-columns: 2fr 1fr;
  }
`;
const Label = styled("label")`
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  top: auto;
  overflow: hidden;
`;
const Input = styled("input")`
  border-radius: var(--radius);
  border: 1px solid var(--clr-grey-1);
  box-shadow: inset 0 0 4px 0 var(--clr-grey-4);
  height: 42px;
  margin: auto 0;
  padding: 5px 10px;
  width: auto;
  font-size: 1rem;
  &::placeholder {
    text-transform: capitalize;
  }
  @media (min-width: 1200px) {
    font-size: 1.5rem;
  }
`;
const Button = styled("button")`
  color: var(--clr-white);
  background-color: var(--clr-primary-3);
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  font-family: Overpass;
  text-transform: capitalize;
  letter-spacing: 1.5px;
  border: 2px solid var(--clr-primary-3);
  text-align: center;
  font-size: 1rem;
  &:hover {
    cursor: pointer;
    border: 2px solid var(--clr-primary-1);
    background: var(--clr-primary-1);
    box-shadow: 0 10px 21px 0 var(--clr-grey-4);
    border-radius: 23px;
  }
  &:disabled {
    border: 2px solid var(--clr-grey-5);
    background: var(--clr-grey-5);
    box-shadow: none;
    &:hover {
      cursor: default;
    }
  }
`;

const SearchForms = ({ handleParseSearch }) => {
  const [value, setValue] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    handleParseSearch(value);
  };

  return (
    <SearchFormContainer>
      <Form onSubmit={handleSubmit}>
        <Label>SearchForms</Label>
        <Input
          type="text"
          placeholder="search names or addresses"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" disabled={!value.length}>
          search
        </Button>
      </Form>
    </SearchFormContainer>
  );
};

export default SearchForms;
