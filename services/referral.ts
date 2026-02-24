import { get } from './api';

export interface ReferralStats {
    referral_code: string;
    total_referrals: number;
    total_earnings: number;
    commission_rate: number;
    referrals: Array<{
        id: string;
        user: string;
        joined_date: string;
        earnings: number;
        status: string;
    }>;
    [key: string]: any;
}




export async function getReferralStats(): Promise<ReferralStats> {
    return get<ReferralStats>('/api/referral/stats', true);
}
