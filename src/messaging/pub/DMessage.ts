
export interface DMessageData {
    type: string,
    args: Array<unknown>
}

export interface DMessage {
    sender: string;
    recipient: string;
    subRecipients?: Array<string>;
    type: "request" | "event" | "response" | "listen" | "unlisten";
    id?: string;
    message: DMessageData;
    error?: string;
};