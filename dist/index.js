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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const { Server } = require('socket.io');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(cors());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Server Socket connected');
}));
app.get('/ping', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json('Ping worked');
}));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
        ],
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port  ${PORT}`);
});
/** Websocket */
const events = fs.readdirSync(__dirname + '/Events').map((file) => file.replace('.ts', ''));
const Parties = new Map();
const Players = new Map();
io.on('connection', (socket) => {
    events.forEach((eventName) => {
        let event = require(__dirname + `/Events/${eventName}`);
        socket.on(eventName.replace('.js', ''), (payload) => {
            event.exec(io, socket, payload, Parties, Players);
        });
    });
});
