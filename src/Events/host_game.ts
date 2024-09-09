import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";
import { ProfileType } from "../Types/ProfileType";

module.exports = {
    exec: async (io: any, socket: any, payload: ProfileType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

        const uidGenerator = new ShortUniqueId({ length: 6 });
        let uid = uidGenerator.rnd();

        while(parties.has(uid)) {
            uid = uidGenerator.rnd();
        }

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
            // Vérifier que le nombre est dans la plage valide
            if (number >= 1 && number <= maxPicture) {
                player.profile = payload.profile;
            } else {
                player.profile = `${process.env.BACK_URL}/profile_1.jpg`;
            }
        } else {
            player.profile = `${process.env.BACK_URL}/profile_1.jpg`;
        }

        uid = uid.toUpperCase();

        const party = {
            id: uid,
            host: player,
            hostLastConnection: -1,
            players: [player],
            currentTrack: {
                url: "",
                duration: 0,
                currentTime: 0,
                isPlaying: false,
            },
            scoreboard: [],
            currentRound: [],
            currentRoundScore: {},
            roundFinished: false,
            gameState: "Lobby",
        }
        
        parties.set(uid, party);
        socket.join(`party#${party.id}`)
        socket.emit("response#host_game", party)

    }
}