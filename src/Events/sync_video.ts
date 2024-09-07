import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type SyncVideoType = {
    id: string,
    currentTime: number
}

module.exports = {
    exec: async (io: any, socket: any, payload: SyncVideoType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);
        
        if(party) {
            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);

            if(player && party.host.id === player.id)
            {
                party.currentTrack.currentTime = payload.currentTime;
            }

        }
        

    }
}