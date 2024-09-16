import ShortUniqueId from "short-unique-id";
import { GameMode, GameState, PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";
import { ProfileType } from "../Types/ProfileType";
import createParty from "../Functions/createParty";

module.exports = {
    exec: async (io: any, socket: any, payload: ProfileType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const player: PlayerType | undefined = players.get(socket.id);

        if(!player) {
            return;
        }

        let username = payload.username
        let filteredValue = username.replace(/[^a-zA-Z0-9]/g, '');
        if(filteredValue.length === 0) {
            filteredValue = `Guest${Math.floor(Math.random() * 9999) + 1000}`;
        }
        player.username = filteredValue.substring(0, 14);

        const maxPicture = parseInt(process.env.MAX_PICTURE, 10);
        const baseURL = process.env.BACK_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^${baseURL}\\/profile_(\\d+)\\.jpg$`);

        const match = payload.profile.match(regex);

        if (match) {
            const number = parseInt(match[1], 10);
            if (number >= 1 && number <= maxPicture) {
                player.profile = payload.profile;
            } else {
                player.profile = `${process.env.BACK_URL}/profile_1.jpg`;
            }
        } else {
            player.profile = `${process.env.BACK_URL}/profile_1.jpg`;
        }

        const party = createParty(player, parties);
        
        parties.set(party.id, party);
        socket.join(`party#${party.id}`)
        socket.emit("response#host_game", party)

    }
}