import {baseUrl, getLogger} from "./index";

const log=getLogger("GroupAPI")

interface MessageData {
    type: string;
    payload: any;
}
export const newWebSocket = (token: string, onMessage: (data: MessageData) => void, url:string="") => {
    const ws = new WebSocket(`ws://${baseUrl}/proba`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        console.log('web socket onmessage '+messageEvent.data);
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}