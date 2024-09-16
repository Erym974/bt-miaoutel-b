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
        if (party && party.mode === PartyType_1.GameMode.Team) {
            const player = party.players.find(p => p.socket === socket.id);
            if (player) {
                const newTeam = payload.newTeam;
                party.teams.forEach((team) => {
                    if (team.players.includes(player.id)) {
                        team.players = team.players.filter(p => p !== player.id);
                    }
                });
                party.teams[newTeam].players.push(player.id);
                io.to(`party#${party.id}`).emit("update_party", party);
            }
        }
    })
};
