import React from "react";
import "./Header.css";
import completeImage from "../../assets/complete-image.png";
import cibDiscord from "../../assets/cib_discord.png";
const Header = () => {
  return (
    <>
      <section className="Header">
        <h1>The wives of solomon</h1>
        <p>
          1000 free Solomon NFT mint. This free pfp NFT of Solomon will give a
          2x multiplier to all benefits of the Wives of Solomon 10,000 NFT
          collection. Join the Wives of Solomon Free Solomon mint and be part of
          the Solomon Club.
        </p>
        <div className="flex">
          <button
            className="btn btn1"
            onClick={() =>
              window.open("https://discord.com/invite/S4aFr4CqnB", "_blank")
            }
          >
            <span>
              <img src={cibDiscord} alt="" />
            </span>{" "}
            Meet the wives
          </button>
          <button
            className="btn btn2"
            onClick={() =>
              window.open(
                "https://drive.google.com/file/d/1FlICIa-AC8C4DrZwOAue7Db8roJCJxqX/view",
                "_blank"
              )
            }
          >
            Read White Paper
          </button>
        </div>
      </section>
    </>
  );
};

export default Header;
