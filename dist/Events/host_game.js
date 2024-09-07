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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const short_unique_id_1 = __importDefault(require("short-unique-id"));
module.exports = {
    exec: (io, socket, payload, parties, players) => __awaiter(void 0, void 0, void 0, function* () {
        const uidGenerator = new short_unique_id_1.default({ length: 6 });
        let uid = uidGenerator.rnd();
        while (parties.has(uid)) {
            uid = uidGenerator.rnd();
        }
        const player = players.get(socket.id);
        if (!player) {
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
        };
        parties.set(uid, party);
        socket.join(`party#${party.id}`);
        socket.emit("response#host_game", party);
    })
};
