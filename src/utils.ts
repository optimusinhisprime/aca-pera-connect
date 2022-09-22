import algosdk from "algosdk";
import { SignerTransaction } from "@perawallet/connect/dist/util/model/peraWalletModels";
const algod = new algosdk.Algodv2(
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "https://node.testnet.algoexplorerapi.io",
  443
);

async function generateOptIntoAssetTxns({
  assetID,
  initiatorAddr,
}: {
  assetID: number;
  initiatorAddr: string;
}): Promise<SignerTransaction[]> {
  const suggestedParams = await algod.getTransactionParams().do();
  const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: initiatorAddr,
    to: initiatorAddr,
    assetIndex: assetID,
    amount: 0,
    suggestedParams,
  });

  return [{ txn: optInTxn, signers: [initiatorAddr] }];
}

async function generatePaymentTxns({
  to,
  initiatorAddr,
}: {
  to: string;
  initiatorAddr: string;
}) {
  const suggestedParams = await algod.getTransactionParams().do();

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: initiatorAddr,
    to,
    amount: 1,
    suggestedParams,
  });

  return [{ txn, signers: [initiatorAddr] }];
}

async function generateAssetTransferTxns({
  to,
  assetID,
  initiatorAddr,
}: {
  to: string;
  assetID: number;
  initiatorAddr: string;
}) {
  const suggestedParams = await algod.getTransactionParams().do();

  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: initiatorAddr,
    to,
    assetIndex: assetID,
    amount: 1,
    suggestedParams,
  });

  return [{ txn, signers: [initiatorAddr] }];
}

async function optInTransaction({
  assetID,
  initiatorAddr,
  peraWalletInstance,
}: {
  assetID: number;
  initiatorAddr: string;
  peraWalletInstance: any;
}) {
  try {
    const data = {
      assetId: assetID,
      walletAddress: initiatorAddr,
    };
    const JSONdata = JSON.stringify(data);

    const endpoint = "http://localhost:3001/api/v1/agent/opt-in";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.s
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    const txGroup = [{ txn: result.transaction, signers: [initiatorAddr] }];

    await peraWalletInstance.signTransaction([txGroup]);
    console.log("Transaction Signed.");
    alert("Transaction Signed.");
  } catch (error) {
    console.log("Couldn't sign Opt-in txns", error);
  }
}

export {
  generateOptIntoAssetTxns,
  generateAssetTransferTxns,
  generatePaymentTxns,
  optInTransaction,
};
