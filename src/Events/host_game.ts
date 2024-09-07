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

        player.username = payload.username;
        player.profile = payload.profile;

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
            currentRound: [],
            roundFinished: false,
            gameState: "Lobby",
        }

        parties.set(uid, party);
        socket.join(`party#${party.id}`)
        socket.emit("response#host_game", party)

    }
}