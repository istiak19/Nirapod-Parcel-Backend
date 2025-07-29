import cors from "cors";
import passport from "passport";
import "./app/config/passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { router } from "./app/route";
import { envVars } from "./app/config/env.config";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true
}));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.send("Nirapod Parcel Backend API is running successfully!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;