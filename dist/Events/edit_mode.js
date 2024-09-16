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
const PartyType_1 = require("../Types/PartyType");
module.exports = {
    exec: (io, socket, payload, parties, players) => __awaiter(void 0, void 0, void 0, function* () {
        const party = parties.get(payload.id);
        if (party) {
            const player = party.players.find(p => p.socket === socket.id);
            if (player && player.id === party.host.id) {
                switch (payload.mode) {
                    case PartyType_1.GameMode.Team:
                        party.mode = PartyType_1.GameMode.Team;
                        // repartir les joueurs en 2 équipes
                        const players = party.players;
                        const first_team = players.slice(0, players.length / 2);
                        const second_team = players.slice(players.length / 2);
                        party.teams[0].players = first_team.map(player => player.id);
                        party.teams[1].players = second_team.map(player => player.id);
                        break;
                    default:
                        party.mode = PartyType_1.GameMode.Individual;
                        party.teams[0] = Object.assign(Object.assign({}, party.teams[0]), { players: [], score: 0 });
                        party.teams[1] = Object.assign(Object.assign({}, party.teams[1]), { players: [], score: 0 });
                        break;
                }
                io.to(`party#${party.id}`).emit("update_party", party);
                console.log(party);
            }
        }
    })
};
