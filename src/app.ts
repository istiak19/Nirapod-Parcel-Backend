import cors from "cors";
import express, { Application, Request, Response } from "express";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { router } from "./app/route";

const app: Application = express();

app.use(express.json());
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