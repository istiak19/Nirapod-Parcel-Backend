"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
require("./app/config/passport");
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const route_1 = require("./app/route");
const env_config_1 = require("./app/config/env.config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: env_config_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://nirapod-parcel.netlify.app"
    ],
    credentials: true
}));
app.use("/api/v1", route_1.router);
app.get("/", (req, res) => {
    res.send("Nirapod Parcel Backend API is running successfully!");
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
