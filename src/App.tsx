import React, { useState, useEffect } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import { optInTransaction } from "./utils";

export const peraWallet = new PeraWalletConnect();

function App() {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const isConnectedToPeraWallet = !!accountAddress;

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
    </div>
  );
}

export default App;
