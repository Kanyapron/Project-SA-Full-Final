import { Key } from "react";

export interface MessageInterface {
  [x: string]: Key | null | undefined;
	room_chat_id?: number;
	content: string;
	sender_id: number;
	picture_content: string;
  }
  