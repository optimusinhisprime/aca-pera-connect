import algosdk, { Transaction } from "algosdk";
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
    const txGroups = await generateOptIntoAssetTxns({
      assetID: assetID,
      initiatorAddr: initiatorAddr,
    });

    await peraWalletInstance.signTransaction([txGroups]);
    // update the optinusdc flag for the connected wallet
    console.log("Transaction Signed.");
    const data = {
      walletAddress:
        "6HXGOBTXRPCXTOCIIVY3JVPAYFJ63TVJ2CP7HC4I5ZQNIXH6NIEBESPQVI",
    };
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMmY1MTViYy0yMDJmLTQyYTItYjMwMy03Njk0MzA4MDhmNTUiLCJmaXJzdE5hbWUiOiJXaWxsIiwibGFzdE5hbWUiOiJLd2VsYWdvYmUiLCJlbWFpbCI6IndpbGxAYWZyaWNhY29kZS5hY2FkZW15IiwicGhvbmVOdW1iZXIiOiIrMjY3NzQwMDgyNzQiLCJ1c2VyVHlwZSI6IlJlZ3VsYXIiLCJpYXQiOjE2NjUxMjQxODcsImV4cCI6MTY2NTE0NTc4N30.dCe8ZWF70JGuL96DKeiUAcbuG2cnaFYOtR9BagZ-q7g"
    );
    myHeaders.append("Content-Type", "application/json");

    fetch(
      "http://backend-env.us-east-2.elasticbeanstalk.com/api/v1/agents/02f515bc-202f-42a2-b303-769430808f55/opt-in",
      {
        method: "PUT",
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
  } catch (error) {
    console.log("Couldn't sign Opt-in txns", error);
  }
}

async function generateOptIntoContractTxns({
  contractID,
  initiatorAddr,
}: {
  contractID: any;
  initiatorAddr: string;
}): Promise<SignerTransaction[]> {
  const suggestedParams = await algod.getTransactionParams().do();
  // create unsigned transaction
  let optInTxn = algosdk.makeApplicationOptInTxn(
    initiatorAddr,
    suggestedParams,
    Number(contractID)
  );
  return [{ txn: optInTxn, signers: [initiatorAddr] }];
}

async function optInContractTransaction({
  contractID,
  initiatorAddr,
  peraWalletInstance,
}: {
  contractID: any;
  initiatorAddr: string;
  peraWalletInstance: any;
}) {
  try {
    const txGroups = await generateOptIntoContractTxns({
      contractID: contractID,
      initiatorAddr: initiatorAddr,
    });
    await peraWalletInstance.signTransaction([txGroups]);
  } catch (error) {
    console.log("Couldn't sign Opt-in txns", error);
  }
}

export {
  generateOptIntoAssetTxns,
  generateAssetTransferTxns,
  generatePaymentTxns,
  optInTransaction,
  optInContractTransaction,
};
