import { ethers } from "ethers";

const requestAccount = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
};

const getProvider = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          // Request account access if needed
          await requestAccount();
          // Accounts now exposed
          resolve(provider);
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new ethers.providers.JsonRpcProvider();
        resolve(provider);
      }
    });
  });

export default getProvider;
