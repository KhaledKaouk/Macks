export interface EndPoint{
    _id: string;
    endpoint: string;
    expirationTime: string;
    keys: {
        p256dh: string;
        auth: string;
    }
}