import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
// import suggestedParams from "algosdk/dist/types/src/client/v2/algod/suggestedParams";
async function connectWallet(accountAddress: string){
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
  return connector

}
async function walletSignTransaction(accountAddress: string) {
    const connector = await connectWallet(accountAddress)
  // Draft transaction
  const algod = new algosdk.Algodv2(
    "",
    "https://node.testnet.algoexplorerapi.io/",
    443
  );
  const suggestedParams = await algod.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: accountAddress,
    to: "MGSXHSKG3WVYZ4DVBZXRDFA34VIM2TFWTJTX2AJWDAI6EHPG2HK3T22KCE",
    amount: 100000,
    suggestedParams,
  });
  console.log("Transaction", txn);
  // Sign transaction
  // txns is an array of algosdk.Transaction like below
  // i.e txns = [txn, ...someotherTxns], but we've only built one transaction in our case
  const txns = [txn];
  const txnsToSign = txns.map((txn) => {
    const encodedTxn = Buffer.from(
      algosdk.encodeUnsignedTransaction(txn)
    ).toString("base64");

    return {
      txn: encodedTxn,
      message: "Description of transaction being signed",
      // Note: if the transaction does not need to be signed (because it's part of an atomic group
      // that will be signed by another party), specify an empty singers array like so:
      // signers: [],
    };
  });

  const requestParams = [txnsToSign];

  const request = formatJsonRpcRequest("algo_signTxn", requestParams);
  const result: Array<string | null> = await connector.sendCustomRequest(
    request
  );
  const decodedResult = result.map((element) => {
    return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
  });
}

export {
    connectWallet,
    walletSignTransaction,
  };