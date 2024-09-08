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
            

            let username = payload.profile.username
            let filteredValue = username.replace(/[^a-zA-Z0-9]/g, '');
            if(filteredValue.length === 0) {
                filteredValue = `Guest${Math.floor(Math.random() * 9999) + 1000}`;
            }
            player.username = filteredValue.substring(0, 14);

            const maxPicture = parseInt(process.env.MAX_PICTURE, 10);
            const baseURL = process.env.BACK_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`^${baseURL}\\/profile_(\\d+)\\.jpg$`);
    
            const match = payload.profile.profile.match(regex);
    
            if (match) {
                const number = parseInt(match[1], 10);
                // Vérifier que le nombre est dans la plage valide
                if (number >= 1 && number <= maxPicture) {
                    player.profile = payload.profile.profile;
                } else {
                    player.profile = `${process.env.BACK_URL}/profile_1.jpg`;
                }
            } else {
                player.profile = `${process.env.BACK_URL}/profile_1.jpg`;
            }

            party.players.push(player);

            socket.join(`party#${party.id}`)
            socket.broadcast.to(`party#${party.id}`).emit('update_party', party);

        }

        return socket.emit("response#join_party", party)

    }
}