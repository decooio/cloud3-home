import { Transaction } from "algosdk";
import * as _ from "lodash";
import { PeraWalletConnect } from "@perawallet/connect";
import { SignerTransaction } from "@perawallet/connect/dist/util/model/peraWalletModels";

export function getAlgoSigner(wallet: PeraWalletConnect) {
  return async (txnGroup: Transaction[], indexesToSign: number[]) => {
    const walletTxns: SignerTransaction[] = _.map(indexesToSign, (t) => {
      return { txn: txnGroup[t] };
    });
    const signedTxns = await wallet.signTransaction([walletTxns]);
    return Promise.resolve(signedTxns);
  };
}
