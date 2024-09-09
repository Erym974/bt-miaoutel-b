import ShortUniqueId from "short-unique-id";
import { PartyType } from "../Types/PartyType";
import { PlayerType } from "../Types/PlayerType";

type RestartGameType = {
  id: string;
  newParty: string | undefined;
};

module.exports = {
  exec: async (
    io: any,
    socket: any,
    payload: RestartGameType,
    parties: Map<string, PartyType>,
    players: Map<string, PlayerType>
  ) => {
    const party: PartyType | undefined = parties.get(payload.id);

    if (party) {
      const player: PlayerType | undefined = party.players.find(
        (p) => p.socket === socket.id
      );

      if (player && player.id === party.host.id) {
        const uidGenerator = new ShortUniqueId({ length: 6 });
        let uid = uidGenerator.rnd();

        while (parties.has(uid)) {
          uid = uidGenerator.rnd();
        }

        uid = uid.toUpperCase();

        const newParty = {
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
        };

        parties.set(uid, newParty);
        player.score = 0;
        socket.leave(`party#${party.id}`);
        socket.join(`party#${newParty.id}`);
        socket.emit("response#restart", newParty);

        io.to(`party#${party.id}`).emit("new_game_available", newParty);
      } else {
        if (payload.newParty && player) {
          const newParty: PartyType | undefined = parties.get(payload.newParty);

          if (newParty) {
            newParty.players.push(player);
            player.score = 0;
            socket.leave(`party#${party.id}`);
            socket.emit("response#restart", newParty);
            socket.join(`party#${newParty.id}`);
            socket.broadcast.to(`party#${newParty.id}`).emit("update_party", newParty);
          }
        }
      }
    }
  },
};
