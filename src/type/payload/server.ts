import { BasePayload, RequestPayload } from "../message";

export interface RoomCreatePayload extends RequestPayload {
  name: string
}

export interface RoomCreateResponse extends RequestPayload {
  roomId: string
}

export interface RoomListPayload extends BasePayload {
  name?: string
}

export interface PlayerEntryPayload extends BasePayload {
  deck: string[]
  roomId: string;
  player: {
    name: string;
    id: string;
  }
}