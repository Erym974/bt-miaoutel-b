import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType"
import { PlayerType } from "../Types/PlayerType";

type CheckPartyType = {
    id: string
}

module.exports = {
    exec: async (io: any, socket: any, payload: CheckPartyType, parties: Map<string, PartyType>, players: Map<string, PlayerType>) => {
        const party: PartyType | undefined = parties.get(payload.id);
        return socket.emit("response#check_party", party)

    }
}