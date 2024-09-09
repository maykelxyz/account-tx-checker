import { createHash } from "crypto";
import { EthereumTransactionInfo } from "../../Domain/Entities/TransactionResultInfo";
import { DbRepository } from "./DbRepository";
import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { ethers } from 'ethers';
import dotenv from "dotenv";
dotenv.config();
const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);
export class EthereumRepository {
    private _dbRepo: DbRepository;
    constructor() {
        this._dbRepo = new DbRepository();
    }
    async getBlockTimestamp(blockHex: string): Promise<Date> {
        const blockNumber = parseInt(blockHex, 16);
        const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_API_KEY);
        const block = await provider.getBlock(blockNumber);
        const unix = block?.timestamp!;
        const timestamp = new Date(unix * 1000);
        return timestamp;
    }
    async getUserTransactions(accountId: string): Promise<{ data?: EthereumTransactionInfo[], error?: string, count?: number; }> {
        try {
            const result = await this._dbRepo.getAllUsers();
            const accountInfo = result.find(user => user.id === accountId);

            if (accountInfo) {
                let ret: EthereumTransactionInfo[] = [];
                const mainAddress = accountInfo.address;
                const toAddress = await alchemy.core.getAssetTransfers({
                    fromBlock: "0x0",
                    toAddress: mainAddress,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL],
                });
                const fromAddress = await alchemy.core.getAssetTransfers({
                    fromBlock: "0x0",
                    fromAddress: mainAddress,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL],
                });

                // Process 'from' transfers
                for (const transfer of fromAddress.transfers) {
                    if (!transfer.erc721TokenId && !transfer.erc1155Metadata) {
                        const date = await this.getBlockTimestamp(transfer.blockNum);
                        const newTransfer: EthereumTransactionInfo = {
                            id: this.encryptParameter(transfer.hash),
                            fromAddress: transfer.from,
                            toAddress: transfer.to!,
                            accountId: accountInfo.id,
                            type: "withdrawal",
                            amount: transfer.value || 0,
                            symbol: transfer.asset!,
                            decimal: parseInt(transfer.rawContract.decimal!, 16),
                            timestamp: date,
                            txnHash: transfer.hash
                        };
                        ret.push(newTransfer);
                    }
                }
                for (const transfer of toAddress.transfers) {
                    if (!transfer.erc721TokenId && !transfer.erc1155Metadata) {
                        const date = await this.getBlockTimestamp(transfer.blockNum);
                        const newTransfer: EthereumTransactionInfo = {
                            id: this.encryptParameter(transfer.hash),
                            fromAddress: transfer.from,
                            toAddress: transfer.to!,
                            accountId: accountInfo.id,
                            type: "deposit",
                            amount: transfer.value || 0,
                            symbol: transfer.asset!,
                            decimal: parseInt(transfer.rawContract.decimal!, 16),
                            timestamp: date,
                            txnHash: transfer.hash
                        };
                        ret.push(newTransfer);
                    }
                }
                ret.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                return { data: ret, count: ret.length };
            } else {
                return { error: `User does not exist in the application` };
            }
        } catch (error) {
            console.error("Error fetching user transactions:", error);
            return { error: "An error occurred while fetching user transactions" };
        }
    }
    private encryptParameter(address: string): string {
        const salt = process.env.SECRET_SALT;
        const hash = createHash('sha256');
        hash.update(address + salt!);
        return hash.digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '')
            .substring(0, 20);
    }
}