import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";
import { ProfileType } from "../Types/ProfileType";

type JoinPartyType = {
    id: string,
    profile: ProfileType
}

module.exports = {
    exec: async (io: any, socket: any, payload: JoinPartyType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const party: PartyType | undefined = parties.get(payload.id);
        

        if(party) {

            const player: PlayerType | undefined = players.get(socket.id);

            if(!player) {
                return;
            }
    
            player.username = payload.profile.username;
            player.profile = payload.profile.profile;

            party.players.push(player);

            socket.join(`party#${party.id}`)
            socket.broadcast.to(`party#${party.id}`).emit('update_party', party);

        }

        return socket.emit("response#join_party", party)

    }
}