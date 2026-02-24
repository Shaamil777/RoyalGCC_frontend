import { post, setAuthToken, setStoredUser, removeAuthToken, removeStoredUser, getStoredUser, getAuthToken } from './api';


export interface User {
    id: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    referral_code: string;
    kyc_status: string;
    email: string;
    created_at?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}


// send otp to the user's phone
export async function sendOtp(accountNumber: string): Promise<{ message: string }> {
    return post('/api/auth/send-otp', { accountNumber });
}

// login and persist the token + user locally
export async function login(accountNumber: string, otp: string): Promise<AuthResponse> {
    const result = await post<AuthResponse>('/api/auth/login', { accountNumber, otp });

    // save session
    await setAuthToken(result.token);
    await setStoredUser(result.user);

    return result;
}

// signup with bank details + otp, then persist session
export async function signup(data: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    otp: string;
    referralCode?: string;
}): Promise<AuthResponse> {
    const result = await post<AuthResponse>('/api/auth/signup', data);

    // save session
    await setAuthToken(result.token);
    await setStoredUser(result.user);

    return result;
}


export async function logout(): Promise<void> {
    await removeAuthToken();
    await removeStoredUser();
}


export async function isAuthenticated(): Promise<boolean> {
    const token = await getAuthToken();
    return !!token;
}


export async function getCurrentUser(): Promise<User | null> {
    return getStoredUser();
}
