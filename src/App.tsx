import React, { useState, useEffect } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import { optInTransaction, optInContractTransaction } from "./utils";

export const peraWallet = new PeraWalletConnect();

function App() {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const isConnectedToPeraWallet = !!accountAddress;
  const [loanId, setLoanId] = useState<BigInt>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    optInContractTransaction({
      contractID: loanId as BigInt,
      initiatorAddr: accountAddress || "",
      peraWalletInstance: peraWallet,
    });
  };

  const handleChange = async (event: any) => {
    setLoanId(event.target.value);
  };

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet.reconnectSession().then(async (accounts) => {
      // Setup the disconnect event listener
      peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

      if (!accounts.length) {
        setAccountAddress(accounts[0]);
      }
    });
  }, []);

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then(async (newAccounts) => {
        console.log(newAccounts);

        // Setup the disconnect event listener
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

        setAccountAddress(newAccounts[0]);
        //send account address to the backend for new wallet entry.

        const data = { walletAddress: newAccounts[0] };
        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMmY1MTViYy0yMDJmLTQyYTItYjMwMy03Njk0MzA4MDhmNTUiLCJmaXJzdE5hbWUiOiJXaWxsIiwibGFzdE5hbWUiOiJLd2VsYWdvYmUiLCJlbWFpbCI6IndpbGxAYWZyaWNhY29kZS5hY2FkZW15IiwicGhvbmVOdW1iZXIiOiIrMjY3NzQwMDgyNzQiLCJ1c2VyVHlwZSI6IlJlZ3VsYXIiLCJpYXQiOjE2NjUxMjQxODcsImV4cCI6MTY2NTE0NTc4N30.dCe8ZWF70JGuL96DKeiUAcbuG2cnaFYOtR9BagZ-q7g"
        );
        myHeaders.append("Content-Type", "application/json");

        fetch(
          "http://backend-env.us-east-2.elasticbeanstalk.com/api/v1/agents/02f515bc-202f-42a2-b303-769430808f55/wallet-connection",
          {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.log(error);

        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }
      });
  }
  function handleDisconnectWalletClick() {
    peraWallet.disconnect();

    setAccountAddress(null);
  }
  return (
    <div className="App">
      <button
        onClick={
          isConnectedToPeraWallet
            ? handleDisconnectWalletClick
            : handleConnectWalletClick
        }
      >
        {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
      </button>
      <br />
      {isConnectedToPeraWallet && (
        <>
          <button
            onClick={() =>
              optInTransaction({
                assetID: 10458941,
                initiatorAddr: accountAddress,
                peraWalletInstance: peraWallet,
              })
            }
          >
            OptIn to USDC
          </button>
        </>
      )}
      <br />
      <div>
        {isConnectedToPeraWallet && (
          <form onSubmit={handleSubmit}>
            <label>
              Enter Loan Id to Process:
              <input type="text" name="loanId" onChange={handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
