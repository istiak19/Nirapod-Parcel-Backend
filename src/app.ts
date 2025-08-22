import cors from "cors";
import "./app/config/passport";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env.config";
import express, { Application, Request, Response } from "express";
import { router } from "./app/route";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.set("trust proxy", 1);
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://nirapod-parcel.netlify.app"
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