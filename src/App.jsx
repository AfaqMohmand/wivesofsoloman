import { Fragment, useState } from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Header from "./components/header/Header";
import NftForm from "./components/nftForm/NftForm";
import { ToastProvider } from "react-toast-notifications";
const App = () => {
  const [address, setAddress] = useState("");
  return (
    <Fragment>
      <ToastProvider>
        <div className="App">
          <Navbar address={address} setAddress={setAddress} />
          <Header />
          <NftForm address={address} setAddress={setAddress} />
        </div>
      </ToastProvider>
    </Fragment>
  );
};

export default App;
