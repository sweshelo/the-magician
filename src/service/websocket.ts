import { Message } from "@/submodule/suit/types/message/message";
import { RequestPayload } from "@/submodule/suit/types/message/payload/base";
import EventEmitter from "events";

class WebSocketService extends EventEmitter {
  private socket: WebSocket;

  constructor(url: string) {
    super()
    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      this.emit('open');
    })

    this.socket.addEventListener('close', () => {
      this.emit('close')
      throw Error('WebSocket Connection Closed.');
    })
  }

  // メッセージをサーバに送る
  // 主にゲーム内で利用
  send(message: Message) {
    this.socket.send(JSON.stringify(message));
  }

  // あるメッセージに対してサーバ側の応答を待たす
  // 主にゲーム外で利用
  async request<T extends RequestPayload, R extends RequestPayload>(message: Message<T>): Promise<Message<R>> {
    this.socket.send(JSON.stringify(message));

    return new Promise((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        try {
          const response = JSON.parse(e.data) as Message<R>;
          const { payload } = response;
          if ('requestId' in payload && payload.requestId === payload.requestId) {
            this.socket.removeEventListener('message', handler)
            resolve(response)
          }
        } catch (e) {
          this.socket.removeEventListener('message', handler)
          reject(e)
        }
      }

      this.socket.addEventListener('message', handler);
    })
  }
}

export const webSocketService = new WebSocketService('ws://localhost:4000/');