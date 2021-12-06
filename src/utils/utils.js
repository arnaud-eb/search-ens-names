import {
  validateName,
  parseSearchTerm as _parseSearchTerm,
} from "@ensdomains/ui/src/utils/index";

export const truncateAddress = (address) => {
  return address.slice(0, 14) + "..." + address.slice(-4);
};
export const truncateName = () => {};

export const parseSearchTerm = (term) => {
  const domains = term.split(".");
  const tld = domains[domains.length - 1];
  try {
    validateName(tld);
  } catch (e) {
    return "invalid";
  }
  return _parseSearchTerm(term, true);
};

export const networkName = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
};
