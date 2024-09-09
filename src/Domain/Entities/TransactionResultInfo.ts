export interface EthereumTransactionInfo {
    id: string;
    accountId: string;
    toAddress: string;
    fromAddress: string;
    type: string;
    amount: number;
    symbol: string;
    decimal: number;
    timestamp: Date;
    txnHash: string;
}
