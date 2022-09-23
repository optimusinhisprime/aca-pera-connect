import React, { useState, useEffect } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { walletSignTransaction } from "./walletConnect";
async function App() {
  // Create a connector
  const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
  });

  // Check if connection is already established
  if (!connector.connected) {
    // create new session
    await connector.createSession();
  }

  // Subscribe to connection events
  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }

    // Get provided accounts
    const { accounts } = payload.params[0];
    console.log("First Accounts", accounts);
  });

  connector.on("session_update", (error, payload) => {
    if (error) {
      console.log(error);
      throw error;
    }

    // Get updated accounts
    const { accounts } = payload.params[0];
    console.log("Second accounts", accounts);
  });

  connector.on("disconnect", (error, payload) => {
    if (error) {
      console.log(error);
      throw error;
    }
  });
  return (
    <div className="App">
      {/* <button onClick={connector}>
        {connector ? "Disconnect" : "Wallet Connect"}
      </button> */}

      {connector && (
        <>

          {/* <button onClick={() => walletSignTransaction(accountAddress)}>
            Transaction
          </button> */}
        </>
      )}
    </div>
  );
}

export default App;
