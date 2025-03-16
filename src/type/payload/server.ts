import { BasePayload } from "../message";

/**
 * @params name ルーム名
 */
export interface RoomCreatePayload extends BasePayload {
  name: string
}

export interface RoomListPayload extends BasePayload {
  name?: string
}