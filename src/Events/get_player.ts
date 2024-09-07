import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type GetPlayerType = {
    gameId: string,
    oldPlayer: PlayerType | undefined,
}

module.exports = {
    exec: async (io: any, socket: any, payload: GetPlayerType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        if(players.has(socket.id)) {
            socket.emit("response#get_player", players.get(socket.id))
        } else {
            if(payload.oldPlayer) {
                if(players.has(payload.oldPlayer.socket)) {
                    players.set(socket.id, {...payload.oldPlayer, socket: socket.id, connected: false});
                    players.delete(payload.oldPlayer.socket);
                    socket.emit("response#get_player", players.get(socket.id));
                }
            } else {
                socket.emit("response#get_player", undefined)
            }
        }


    }
}