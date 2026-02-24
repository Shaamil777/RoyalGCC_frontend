import { get, post } from './api';

export interface ExchangeRate {
    rate: number;
}

export interface ExchangeOrder {
    id: string;
    user_id: string;
    usdt_amount: number;
    inr_amount: number;
    rate: number;
    status: string;
    created_at: string;
    [key: string]: any;
}

export interface CreateOrderRequest {
    usdtAmount: number;
    bankAccountId?: string;
    bankDetails?: {
        account_number: string;
        ifsc: string;
        account_holder_name: string;
    };
}



// fetch current usdt/inr rate
export async function getRate(): Promise<ExchangeRate> {
    return get<ExchangeRate>('/api/exchange/rate');
}

// get user's past orders (auth required)
export async function getOrders(): Promise<ExchangeOrder[]> {
    return get<ExchangeOrder[]>('/api/exchange/orders', true);
}

// place a new usdt → inr order
export async function createOrder(data: CreateOrderRequest): Promise<ExchangeOrder> {
    return post<ExchangeOrder>('/api/exchange/create-order', data as any, true);
}
