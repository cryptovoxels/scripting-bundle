import { FeatureDescription, PlayerDescription, VidScreenKeys } from "./types";

export enum SupportedMessageTypes {
  Join = "join",
  PlayerEnter = "playerenter",
  PlayerLeave = "playerleave",
  PlayerNearby = "playernearby",
  PlayerAway = "playeraway",
  Move = "move",
  Click = "click",
  Keys = "keys",
  Start = "start",
  Stop = "stop",
  Chat = "chat",
  Changed = "changed",
  Trigger = "trigger",
  Patch = "patch",
}

export type BasicMessage = {
  target: string;
  type: SupportedMessageTypes;
  player: PlayerDescription;
  event?: Record<string, unknown>;
};

export interface JoinMessage extends BasicMessage {
  type: SupportedMessageTypes.Join;
}

export interface PlayerEnterMessage extends BasicMessage {
  type: SupportedMessageTypes.PlayerEnter;
}
export interface PlayerLeaveMessage extends BasicMessage {
  type: SupportedMessageTypes.PlayerLeave;
}
export interface PlayerNearbyMessage extends BasicMessage {
  type: SupportedMessageTypes.PlayerNearby;
}
export interface PlayerAwayMessage extends BasicMessage {
  type: SupportedMessageTypes.PlayerAway;
}

export interface MoveMessage extends BasicMessage {
  type: SupportedMessageTypes.Move;
  position: number[];
  rotation: number[];
}
export interface ClickMessage extends BasicMessage {
  type: SupportedMessageTypes.Click;
  uuid: string;
  event: { point?: number[]; normal?: number[]; guiTarget?: string };
}
export interface KeysMessage extends BasicMessage {
  type: SupportedMessageTypes.Keys;
  uuid: string;
  event: { keys: VidScreenKeys };
}
export interface StartMessage extends BasicMessage {
  type: SupportedMessageTypes.Start;
  uuid: string;
}
export interface StopMessage extends BasicMessage {
  type: SupportedMessageTypes.Stop;
  uuid: string;
}
export interface ChatMessage extends BasicMessage {
  type: SupportedMessageTypes.Chat;
  uuid: string;
  event: { text: string };
}
export interface ChangedMessage extends BasicMessage {
  type: SupportedMessageTypes.Changed;
  uuid: string;
  event: { value?: string; text?: string };
}
export interface TriggerMessage extends BasicMessage {
  type: SupportedMessageTypes.Trigger;
  uuid: string;
  event: {};
}
export interface PatchMessage extends BasicMessage {
  type: SupportedMessageTypes.Patch;
  uuid: string;
  event: Partial<FeatureDescription>;
}

export type Message =
  | JoinMessage
  | PlayerEnterMessage
  | PlayerLeaveMessage
  | PlayerNearbyMessage
  | PlayerAwayMessage
  | MoveMessage
  | ClickMessage
  | KeysMessage
  | StartMessage
  | StopMessage
  | ChatMessage
  | ChangedMessage
  | TriggerMessage
  | PatchMessage;
