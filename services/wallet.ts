import { get, post } from './api';

export interface WalletBalance {
    available_balance: number;
    locked_balance: number;
}

export interface DepositAddress {
    address: string;
    [key: string]: any;
}


export async function getBalance(): Promise<WalletBalance> {
    return get<WalletBalance>('/api/wallet/balance', true);
}


export async function generateDepositAddress(): Promise<DepositAddress> {
    return post<DepositAddress>('/api/wallet/generate-address', undefined, true);
}
