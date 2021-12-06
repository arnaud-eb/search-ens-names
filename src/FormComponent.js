import React, { useState, useEffect } from "react";
import styled from "@emotion/styled/macro";

import getProvider from "./utils/getProvider";
import { parseSearchTerm, networkName } from "./utils/utils";

import SearchForms from "./components/SearchForm";
import Records from "./components/Records";
import Message from "./components/Message";

const FormComponentContainer = styled("section")`
  background-color: var(--clr-white);
  border-radius: var(--radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 1rem;
`;

function FormComponent() {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", msg: "" });
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const records = { avatar, address, name };
  // const [records, setRecords] = useState({ avatar: "", address: "", name: "" });
  // const [error, setError] = useState({ show: false, msg: "" });
  // const [success, setSuccess] = useState({ show: false, msg: "" });
  console.log("records", records);

  // const showAlert = (show = false, type = '', msg = '') => {
  //   setAlert({ show, type, msg });
  // };

  const init = async () => {
    try {
      const provider = await getProvider();
      setProvider(provider);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async (type, value) => {
    setLoading(true);
    try {
      if (type === "address") {
        return await provider.lookupAddress(value);
      } else if (type === "code") {
        return await provider.getCode(value);
      } else {
        return await provider.resolveName(value);
      }
    } catch (error) {
      console.log(error);
      setAlert({ show: true, type: "error", msg: error });
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = async (name) => {
    try {
      const _network = networkName[provider._network.chainId];
      const result = await fetch(
        `https://metadata.ens.domains/${_network}/avatar/${name}/meta`
      );
      const data = await result.json();
      if (data?.image) {
        console.log(data.image);
        setAvatar(data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleName = async (name) => {
    const address = await fetchData("name", name);
    if (!address) {
      setAlert({
        show: true,
        type: "error",
        msg: "No Ethereum address associated with this name",
      });
    } else {
      const code = await fetchData("code", address);
      if (!code === "0x") {
        setAlert({
          show: true,
          type: "error",
          msg: "Note that the address is a contract address",
        });
      }
      setAddress(address);
      setName(name);
    }
  };

  const handleAddress = async (address) => {
    const name = await fetchData("address", address);
    const code = await fetchData("code", address);
    if (!name) {
      setAlert({
        show: true,
        type: "error",
        // msg: `No primary ENS name (reverse record) associated with this address${code}`,
        msg: `No primary ENS name (reverse record) associated with this address${
          code !== "0x" ? ". Note that the address is a contract address." : ""
        }`,
      });
      setAddress(address);
    } else {
      const code = await fetchData("code", address);
      if (!code === "0x") {
        setAlert({
          show: true,
          type: "error",
          msg: "Note that the address is a contract address",
        });
      }
      setAddress(address);
      setName(name);
    }
  };

  const handleParseSearch = (value) => {
    setAlert({ show: false, type: "", msg: "" });
    setAvatar("");
    setAddress("");
    setName("");
    const type = parseSearchTerm(value);
    if (type === "supported" || type === "short") {
      handleName(value);
    } else if (type === "address") {
      handleAddress(value);
    } else if (value.startsWith("0x")) {
      setAlert({
        show: true,
        type: "error",
        msg: "Invalid Ethereum address",
      });
    } else {
      setAlert({
        show: true,
        type: "error",
        msg: "Invalid ENS name",
      });
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (name) {
      getAvatar(name);
    }
  }, [name]);

  return (
    <FormComponentContainer>
      <SearchForms handleParseSearch={handleParseSearch} />
      {alert.show && <Message alert={alert} />}
      <Records records={records} loading={loading} />
    </FormComponentContainer>
  );
}

export default FormComponent;
