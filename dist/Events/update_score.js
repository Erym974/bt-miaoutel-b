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
        const party = parties.get(payload.id);
        if (party) {
            const player = party.players.find(p => p.socket === socket.id);
            if (player && player.id === party.host.id) {
                if (!payload.inRound) {
                    party.players = party.players.map(p => {
                        if (p.id === payload.playerId) {
                            p.score += payload.amount > 0 ? 1 : -1;
                        }
                        return p;
                    });
                }
                else {
                    party.currentRoundScore[payload.playerId] += payload.amount;
                    console.log(party.currentRoundScore[payload.playerId], payload.amount);
                }
                party.players = party.players.sort((a, b) => b.score - a.score);
                io.to(`party#${party.id}`).emit("update_party", party);
            }
        }
    })
};
