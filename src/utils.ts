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
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMzg1OGVlYS1lZDc5LTRiZGQtOTQ1YS01MDc1ODdiZDIxNzAiLCJmaXJzdE5hbWUiOiJQaG9tb2xvIiwibGFzdE5hbWUiOiJQaGlyaSIsImVtYWlsIjoicGhvbW9sb0BhZnJpY2Fjb2RlLmFjYWRlbXkiLCJwaG9uZU51bWJlciI6IisyNjc3NDAwODI4MSIsInVzZXJUeXBlIjoiUmVndWxhciIsImlhdCI6MTY2NTA2ODIxNSwiZXhwIjoxNjY1MTExNDE1fQ.iCnd_AY2iXt14XLd6RfkyWmt9HWMkEqa4YuWrQmZfE4"
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
  contractID: number;
  initiatorAddr: string;
}): Promise<SignerTransaction[]> {
  const suggestedParams = await algod.getTransactionParams().do();
  // create unsigned transaction
  let optInTxn = algosdk.makeApplicationOptInTxn(
    initiatorAddr,
    suggestedParams,
    contractID
  );
  return [{ txn: optInTxn, signers: [initiatorAddr] }];
}

async function optInContractTransaction({
  contractID,
  initiatorAddr,
  peraWalletInstance,
}: {
  contractID: number;
  initiatorAddr: string;
  peraWalletInstance: any;
}) {
  try {
    const txGroups = await generateOptIntoContractTxns({
      contractID: contractID,
      initiatorAddr: initiatorAddr,
    });
    await peraWalletInstance.signTransaction([txGroups]);
  } catch (error) {}
}

export {
  generateOptIntoAssetTxns,
  generateAssetTransferTxns,
  generatePaymentTxns,
  optInTransaction,
  optInContractTransaction,
};
