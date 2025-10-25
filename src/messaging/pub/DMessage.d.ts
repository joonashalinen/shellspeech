export interface DMessageData {
    type: string;
    args: Array<unknown>;
}
export interface DMessage {
    sender: string;
    recipient: string;
    subRecipients?: Array<string>;
    type: "request" | "event" | "response" | "listen";
    id?: string;
    message: DMessageData;
    error?: string;
}
