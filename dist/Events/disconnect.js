"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    exec: (io, socket, payload, parties, players) => __awaiter(void 0, void 0, void 0, function* () {
        const player = players.get(socket.id);
        if (player) {
            let party = null;
            for (let [key, value] of parties) {
                if (value.players.find((p) => p.id === player.id)) {
                    party = value;
                    break;
                }
            }
            if (party) {
                switch (party.gameState) {
                    case "Game":
                        player.connected = false;
                        party.players = party.players.map((p) => p.id === player.id ? Object.assign(Object.assign({}, p), { connected: false }) : p);
                        party.currentTrack.isPlaying = false;
                        if (party.host.socket === socket.id) {
                            party.host.connected = false;
                        }
                        io.to(`party#${party.id}`).emit("player_disconnect", player);
                        io.to(`party#${party.id}`).emit("update_party", party);
                        break;
                    default:
                        party.players = party.players.filter((p) => p.id !== player.id);
                        if (party.host.socket === socket.id) {
                            if (party.players.length > 0) {
                                party.host = party.players[0];
                            }
                            else {
                                parties.delete(party.id);
                            }
                        }
                        io.to(`party#${party.id}`).emit("update_party", party);
                        break;
                }
            }
            else {
                console.log(`Player ${player.id} disconnected`);
                players.delete(player.socket);
            }
        }
    }),
};
