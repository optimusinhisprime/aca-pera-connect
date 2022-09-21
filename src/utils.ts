import algosdk from "algosdk";
import { SignerTransaction } from "@perawallet/connect/dist/util/model/peraWalletModels";

async function generateOptIntoAssetTxns({
  assetID,
  initiatorAddr,
  algod,
}: {
  assetID: number;
  initiatorAddr: string;
  algod: any;
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
    algod,
  });

  try {
    await peraWalletInstance.signTransaction([txGroups]);
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
