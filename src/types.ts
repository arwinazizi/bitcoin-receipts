export interface TxStatus {
    confirmed: boolean;
    block_time: number | null;
}

export interface TxInput {
    prevout: {
        value: number; // sats
        scriptpubkey_address?: string;
    };
}

export interface TxOutput {
    value: number; // sats
    scriptpubkey_address?: string;
}

export interface MempoolTx {
    txid: string;
    fee: number;
    status: TxStatus;
    vin: TxInput[];
    vout: TxOutput[];
}