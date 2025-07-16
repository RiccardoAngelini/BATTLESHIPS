"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorHandler_1 = require("./middleware/ErrorHandler");
const db_connection_1 = __importDefault(require("./database/db_connection"));
const gameRoute_1 = __importDefault(require("./routes/gameRoute"));
const moveRoute_1 = __importDefault(require("./routes/moveRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const app = (0, express_1.default)();
const PORT = process.env.APP_PORT || '3000';
app.get('/', (req, res) => {
    res.send('Hello TypeScript!');
});
app.use(express_1.default.json());
app.use('/api', userRoute_1.default);
app.use('/api', gameRoute_1.default);
app.use('/api', moveRoute_1.default);
db_connection_1.default.init();
app.use(ErrorHandler_1.errHandler);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
