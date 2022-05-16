//@ts-ignore-file
import { Message, SupportedMessageTypes } from "../src/lib/messages";
import Parcel from "../src/parcel";
import { Player } from "../src/player";

export const overrideParcel = (parcel:any)=>{

    parcel.receiveMsg=(obj:Message)=> {
        const ws = {
          readyState: 1,
          player: undefined,
        } as unknown as any;
    
          const data = obj as Message;
          if (
            data &&
            (data.target == "metamask-contentscript" ||
              data.target == "metamask-inpage" ||
              data.target == "inpage")
          ) {
            // ignore metamask messages
            return;
          }
    
          if (!Object.values(SupportedMessageTypes).includes(data.type)) {
            // invalid message type, ignore
            return;
          }
    
          //@ts-ignore
          if (!data.player && !data.player._token) {
            // no player record in the dataPacket, ignore
            return;
          }
          let oldPlayer = parcel.players.get(data.player._token.toLowerCase());
    
          if (oldPlayer) {
            // we have an old player (perfect)
            ws.player = oldPlayer;
            // update player info
            ws.player._set(data.player);
            // console.log('[Scripting] Welcome back ', oldPlayer.name || oldPlayer.wallet || oldPlayer.uuid)
          } else {
            // player is non-existant
            ws.player = new Player(data.player, parcel);
          }
    
          if (!ws.player) {
            console.log("[Scripting] Player non-existant");
          }
    
          // Message is not "Join", redirect to onMessage.
          if (data.type !== SupportedMessageTypes.Join) {
            parcel.onMessage(ws, data);
            return;
          } else {
            // Throw join event.
            parcel.join(ws.player);
          }

    }
    return parcel as Parcel &{receiveMsg:(obj:any)=>any}
}