import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type CreatePlayerType = {
    oldData: PlayerType | undefined
}

module.exports = {
    exec: async (io: any, socket: any, payload: any, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {

    let player : PlayerType = {
        id: new ShortUniqueId().randomUUID(15),
        socket: socket.id,
        username: "Unknown",
        profile: "https://img.freepik.com/free-vector/hand-drawn-side-profile-cartoon-illustration_23-2150517168.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725580800&semt=ais_hybrid",
        isHost: false,
        score: 0,
        connected: true,
    }

    if(players.has(socket.id)) {
        player = players.get(socket.id) as PlayerType;
    } else {
        players.set(socket.id, player);
    }

    socket.emit("response#create_player", player);

    }
}