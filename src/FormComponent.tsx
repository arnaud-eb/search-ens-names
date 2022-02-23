import { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled/macro";

import { getProvider, ProviderType } from "./utils/getProvider";
import { parseSearchTerm, networkName } from "./utils/utils";

import SearchForms from "./components/SearchForm";
import Records from "./components/Records";
import Message from "./components/Message";

interface FetchDataType {
  type: "name" | "code" | "address";
  value: string;
}

export interface ErrorType {
  show: boolean;
  type: "" | "error" | "success";
  msg: string;
}

export interface RecordsType {
  avatar: string;
  address: string;
  name: string;
}

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
  const [provider, setProvider] = useState<ProviderType | null>(null);
  const [alert, setAlert] = useState<ErrorType>({
    show: false,
    type: "",
    msg: "",
  });
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const records: RecordsType = { avatar, address, name };

  const init = async () => {
    try {
      const provider = await getProvider();
      setProvider(provider);
      setAlert({ show: false, type: "", msg: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async ({ type, value }: FetchDataType) => {
    if (!provider) {
      setAlert({
        show: true,
        type: "error",
        msg: "No connection to a Web3 provider",
      });
      init();
    } else {
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
        setAlert({ show: true, type: "error", msg: String(error) });
      } finally {
        setLoading(false);
      }
    }
  };

  const getAvatar = useCallback(
    async (name: string) => {
      try {
        const _network = provider && networkName[provider._network.chainId];
        const result = await fetch(
          `https://metadata.ens.domains/${_network}/avatar/${name}/meta`
        );
        const data = await result.json();
        if (data?.image) {
          setAvatar(data.image);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [provider]
  );

  const handleName = async (name: string) => {
    const address = await fetchData({ type: "name", value: name });
    if (!address) {
      setAlert({
        show: true,
        type: "error",
        msg: "No Ethereum address associated with this name",
      });
    } else {
      const code = await fetchData({ type: "code", value: address });
      if (code !== "0x") {
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

  const handleAddress = async (address: string) => {
    const name = await fetchData({ type: "address", value: address });
    const code = await fetchData({ type: "code", value: address });
    if (!name) {
      setAlert({
        show: true,
        type: "error",
        msg: `No primary ENS name (reverse record) associated with this address${
          code !== "0x" ? ". Note that the address is a contract address." : ""
        }`,
      });
      setAddress(address);
    } else {
      const code = await fetchData({ type: "code", value: address });
      if (code !== "0x") {
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

  const handleParseSearch = (value: string) => {
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
  }, [getAvatar, name]);

  return (
    <FormComponentContainer>
      <SearchForms handleParseSearch={handleParseSearch} />
      {alert.show && <Message alert={alert} />}
      <Records records={records} loading={loading} />
    </FormComponentContainer>
  );
}

export default FormComponent;
