import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type KickPlayerType = {
    id: string,
    player: PlayerType
}

module.exports = {
    exec: async (io: any, socket: any, payload: KickPlayerType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);
        
        if(party) {

            const player : PlayerType | undefined = party.players.find(p => p.socket === socket.id);
            
            if(player && player.id === party.host.id) {
                const kickedPlayer: PlayerType | undefined = players.get(payload.player.socket);

            if(kickedPlayer) {
                party.players = party.players.filter(p => p.id !== kickedPlayer.id);
                let kickedPlayerSocket = io.sockets.sockets.get(kickedPlayer.socket);

                if(kickedPlayerSocket) {
                    kickedPlayerSocket.leave(`party#${party.id}`);
                    socket.to(kickedPlayerSocket.id).emit('kicked_by_host');
                } else {
                    console.error(`Socket for kicked player ${kickedPlayer.socket} not found.`);
                }
                io.to(`party#${party.id}`).emit('update_party', party);
            }
            }
        }


    }
}