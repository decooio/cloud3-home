import { AlgorandChainId } from "@lib/config";
import { PeraWalletConnect } from "@perawallet/connect";
import { AlgorandChainIDs } from "@perawallet/connect/dist/util/peraWalletTypes";

class AlgorandWallet {
  wallet: PeraWalletConnect;
  account: string;

  constructor() {
    this.account = null;
    this.wallet = new PeraWalletConnect({
      chainId: AlgorandChainId as AlgorandChainIDs
    });
    this.wallet.reconnectSession().then(accounts => {
      this.wallet.connector?.on("disconnect", () => {
        this.wallet.disconnect();
        this.account = null;
      });
      if (accounts.length > 0)
        this.account = accounts[0];
    });
  }

  async connect() {
    try {
      let accounts = await this.wallet.reconnectSession();
      if (!this.wallet.isConnected || !accounts.length) {
        accounts = await this.wallet.connect();
      }
      this.wallet.connector?.on("disconnect", () => {
        this.wallet.disconnect();
        this.account = null;
      });
      this.account = accounts[0];
    } catch (error) {
      console.error(error);
    }
  }

  isConnected(): boolean {
    return this.wallet.isConnected && !!this.account;
  }

  disconnect(): void {
    this.wallet.disconnect();
    this.account = null;
  }
}

export default new AlgorandWallet();
