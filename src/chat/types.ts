import { Request } from 'express';
import { User } from 'schemas/user.schema';
import { Socket } from 'socket.io';

// service types
export type CreateChatFields = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

// guard types
type AuthPayload = {
  user: User;
};

export type RequestWithAuth = Request & AuthPayload;
export type SocketWithAuth = Socket & AuthPayload;
