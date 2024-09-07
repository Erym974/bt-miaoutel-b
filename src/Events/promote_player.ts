import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type PromotePlayerType = {
    id: string,
    player: PlayerType
}

module.exports = {
    exec: async (io: any, socket: any, payload: PromotePlayerType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);
        
        if(party) {

            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);
            
            if(player && player.id === party.host.id) {
                const promotedPlayer: PlayerType | undefined = players.get(payload.player.socket);

            if(promotedPlayer) {
                party.host = promotedPlayer;
                io.to(`party#${party.id}`).emit('update_party', party);
            }
            }
        }


    }
}