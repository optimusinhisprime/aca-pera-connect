import algosdk from "algosdk";
import { SignerTransaction } from "@perawallet/connect/dist/util/model/peraWalletModels";

async function generateOptIntoAssetTxns({
  assetID,
  initiatorAddr,
}: {
  assetID: number;
  initiatorAddr: string;
}): Promise<SignerTransaction[]> {
  const algod = new algosdk.Algodv2(
    "",
    "https://node.testnet.algoexplorerapi.io/",
    443
  );
  const amount = 100000;
  const suggestedParams = await algod.getTransactionParams().do();
  const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: initiatorAddr,
    to: initiatorAddr,
    assetIndex: assetID,
    amount: amount,
    suggestedParams,
  });

  return [{ txn: optInTxn, signers: [initiatorAddr] }];
}

async function generatePaymentTxns({
  to,
  initiatorAddr,
  algod,
}: {
  to: string;
  initiatorAddr: string;
  algod: any;
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
  algod,
}: {
  to: string;
  assetID: number;
  initiatorAddr: string;
  algod: any;
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

async function optInTransaction(
  accountAddress: string,
  peraWalletInstance: any,
  algod: any
) {
  const txGroups = await generateOptIntoAssetTxns({
    assetID: 10458941,
    initiatorAddr: accountAddress,
  });

  try {
    await peraWalletInstance.signTransaction([txGroups]);
    console.log(txGroups)
    console.log("Transaction Signed.");
  } catch (error) {
    console.log("Couldn't sign Opt-in txns", error);
    alert("Couldnt sign Opt-in txns.");
  }
}

export {
  generateOptIntoAssetTxns,
  generateAssetTransferTxns,
  generatePaymentTxns,
  optInTransaction,
};
