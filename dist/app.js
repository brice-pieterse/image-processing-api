"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var dogRoutes_1 = __importDefault(require("./routes/dogRoutes"));
exports.app = express_1.default();
var port = 3000;
exports.app.use('/dogs', dogRoutes_1.default);
exports.app.listen(port, function () {
    console.log("Listening on port " + port);
});
