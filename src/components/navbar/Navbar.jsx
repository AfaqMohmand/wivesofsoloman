import React, { Fragment, useEffect } from "react";
import "./Navbar.css";
import Logo from "../../assets/Logo.png";
import web3 from "../../ethereum/web3";
import { useToasts } from "react-toast-notifications";
const Navbar = ({ address, setAddress }) => {
  const { addToast } = useToasts();

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum !== "undefined") {
        let _accounts = await web3.eth.getAccounts();
        if (_accounts.length > 0) {
          setAddress(_accounts[0]);
        }
      }
    })();
    // eslint-disable-next-line
  }, []);
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
  return (
    <Fragment>
      <div className="flex">
        <div className="nav">
          <img src={Logo} alt="" />
          <button type="button" onClick={Connect}>
            {address ? (
              <div className="Nav-Item-Button-Inner-Container">
                {address.slice(0, 4) +
                  "...." +
                  address.slice(address.length - 4, address.length)}{" "}
                &#x23FC;
              </div>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;
