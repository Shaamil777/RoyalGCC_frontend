import { get, postFormData } from './api';

export interface KycStatus {
    kyc_status: string;
    [key: string]: any;
}

export interface KycSubmitResult {
    message?: string;
    [key: string]: any;
}


export async function getKycStatus(): Promise<KycStatus> {
    return get<KycStatus>('/api/kyc/status', true);
}

// submit kyc docs as multipart form
export async function submitKyc(data: {
    full_name: string;
    date_of_birth: string;
    address: string;
    id_type: string;
    aadhaar_image?: {
        uri: string;
        name: string;
        type: string;
    };
}): Promise<KycSubmitResult> {
    const formData = new FormData();

    formData.append('full_name', data.full_name);
    formData.append('date_of_birth', data.date_of_birth);
    formData.append('address', data.address);
    formData.append('id_type', data.id_type);

    if (data.aadhaar_image) {
        formData.append('aadhaar_image', data.aadhaar_image as any);
    }

    return postFormData<KycSubmitResult>('/api/kyc/verify-kyc', formData, true);
}
