import AsyncStorage from '@react-native-async-storage/async-storage';

// update this to point to your backend server
const API_BASE_URL = 'http://192.168.1.100:3000';

const AUTH_TOKEN_KEY = '@royalgcc_auth_token';
const USER_DATA_KEY = '@royalgcc_user_data';

// token + user storage helpers
export async function getAuthToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
        return null;
    }
}

export async function setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function removeAuthToken(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getStoredUser(): Promise<any | null> {
    try {
        const data = await AsyncStorage.getItem(USER_DATA_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

export async function setStoredUser(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export async function removeStoredUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_DATA_KEY);
}


export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}


type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
    method: HttpMethod;
    path: string;
    body?: Record<string, any>;
    auth?: boolean;
    formData?: FormData;
}

async function request<T = any>(options: RequestOptions): Promise<T> {
    const { method, path, body, auth = false, formData } = options;

    const headers: Record<string, string> = {};

    if (auth) {
        const token = await getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    let requestBody: string | FormData | undefined;

    if (formData) {
        // let fetch set content-type for multipart automatically
        requestBody = formData;
    } else if (body) {
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(body);
    }

    const url = `${API_BASE_URL}${path}`;

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: requestBody,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const message = data?.message || `Request failed with status ${response.status}`;
            throw new ApiError(message, response.status);
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            'Network error. Please check your internet connection and try again.',
            0
        );
    }
}

// public helpers
export function get<T = any>(path: string, auth = false): Promise<T> {
    return request<T>({ method: 'GET', path, auth });
}

export function post<T = any>(path: string, body?: Record<string, any>, auth = false): Promise<T> {
    return request<T>({ method: 'POST', path, body, auth });
}

export function postFormData<T = any>(path: string, formData: FormData, auth = false): Promise<T> {
    return request<T>({ method: 'POST', path, formData, auth });
}

export const API_URL = API_BASE_URL;
