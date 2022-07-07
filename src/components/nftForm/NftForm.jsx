import React, { useState, useEffect } from "react";
import "./NftForm.css";
import dummyImg from "../../assets/Logo_Mark_1.png";
import contract from "../../ethereum/collection";
import web3 from "../../ethereum/web3";
import Network from "../../config/Network.json";
import { useToasts } from "react-toast-notifications";
const NftForm = ({ address, setAddress }) => {
  const [amountMinted, setAmountMinted] = useState(0);
  const [hasMintedNft, setHasMintedNft] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [IsCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [correctNetwork] = useState(1);
  const { addToast } = useToasts();

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum !== "undefined") {
        let _amountMinted = await contract.methods.amountMinted().call();
        setAmountMinted(_amountMinted);
        let _quantity = await contract.methods.quantity().call();
        setQuantity(_quantity);
        let _paused = await contract.methods.paused().call();
        setIsPaused(_paused);
        if (address) {
          let _hasMintedNft = await contract.methods
            .availedNftUsers(address)
            .call();
          setHasMintedNft(_hasMintedNft);
        }
      }
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum !== "undefined") {
        if (address) {
          let _hasMintedNft = await contract.methods
            .availedNftUsers(address)
            .call();
          setHasMintedNft(_hasMintedNft);
        }
      }
    })();
    // eslint-disable-next-line
  }, [address]);

  window.ethereum &&
    window.ethereum.on("accountsChanged", function (accounts) {
      // Time to reload your interface with accounts[0]!
      setAddress(accounts[0])(async () => {
        if (accounts[0]) {
          let _hasMintedNft = await contract.methods
            .availedNftUsers(accounts[0])
            .call();
          setHasMintedNft(_hasMintedNft);
        }
      })();
    });

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum !== "undefined") {
        let netId = await web3.eth.net.getId();
        if (parseInt(netId) !== correctNetwork) {
          setIsCorrectNetwork(false);
          return;
        }
        setIsCorrectNetwork(true);
      }
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("networkChanged", function (netId) {
        if (parseInt(netId) !== correctNetwork) {
          setIsCorrectNetwork(false);
          return;
        }
        setIsCorrectNetwork(true);
      });
    }
    // eslint-disable-next-line
  }, [address]);

  const Mint = async (e) => {
    e.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      try {
        let userAddress = address;
        if (!userAddress) {
          const accounts = await web3.eth.requestAccounts();
          userAddress = accounts[0];
          setAddress(accounts[0]);
        }

        setLoading(true);
        await contract.methods.mint().send({
          from: userAddress,
        });
        let _amountMinted = await contract.methods.amountMinted().call();
        setAmountMinted(_amountMinted);
        addToast("NFT Successfully Minted", {
          appearance: "success",
          autoDismiss: false,
        });
      } catch (error) {
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setLoading(false);
      let _paused = await contract.methods.paused().call();
      setIsPaused(_paused);
    } else {
      addToast("Please Install the Metamask Extension", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  const Connect = async (e) => {
    try {
      e.preventDefault();
      if (typeof window.ethereum !== "undefined") {
        if (address) {
          setAddress(null);
        } else {
          const accounts = await web3.eth.requestAccounts();
          console.log(accounts);
          setAddress(accounts[0]);
        }
      } else {
        addToast("Please Install the Metamask Extension", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 5000,
        });
      }
    } catch (error) {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  const SwitchNetwork = async (e) => {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }],
        });
        setIsCorrectNetwork(true);
      } catch (error) {
        console.log(error);
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 5000,
        });
      }
      setLoading(false);
    } else {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  return (
    <section className="nftComplete">
      <img src={dummyImg} className="dummy" alt="" />
      <section className="nftForm">
        <div className="nft-headers">
          <h1>Free Mint NFT</h1>
          <p>{quantity} NFTS</p>
        </div>
        <div className="All-Rows">
          <div className="first-row">
            <h1>Amount</h1>
            <p>
              <span>1</span>
            </p>
            <button className="nft-btn">Max</button>
          </div>
          <div className="second-row">
            <h1>Total</h1>
            <p>0.0 ETH</p>
          </div>
          <div className="second-row third-row">
            <h1>Sold</h1>
            <p>
              {amountMinted} / {quantity}
            </p>
          </div>
          <div className="mint-Btn">
            {!address ? (
              <button className="mint-btn" onClick={Connect}>
                Connect Wallet
              </button>
            ) : isPaused ? (
              <div className="MintedText">Contract is Paused</div>
            ) : hasMintedNft ? (
              <div className="MintedText">NFT Already Minted</div>
            ) : loading ? (
              <div className="loadingText">Awaiting Approval...</div>
            ) : IsCorrectNetwork ? (
              <button className="mint-btn" onClick={Mint}>
                Mint
              </button>
            ) : (
              <button className="mint-btn" onClick={SwitchNetwork}>
                Switch To ETH
              </button>
            )}
          </div>
          <div className="text-start">
            <p>Fair sale of {quantity} NFTs</p>
            <p>
              Giveaway: <span> 100 NFTs </span>
            </p>
            <p>
              Total supply: <span> {quantity} </span>
            </p>
            <p>
              Price: &nbsp; <span> 0 ETH </span>{" "}
            </p>
            <p className="hide">
              Airdroped returns on the validator node investments
            </p>
          </div>
        </div>
      </section>
      <section className="TreasureHunt">
        <div className="treasure-flex">
          <h1>Solomons Treasure Hunt</h1>
          <p>
            Each wife has 10 different personality traits. Collect wives by
            traits and earn big rewards. Get a Solomon multiplier card and win
            rewards.
          </p>
        </div>
      </section>
    </section>
  );
};

export default NftForm;
