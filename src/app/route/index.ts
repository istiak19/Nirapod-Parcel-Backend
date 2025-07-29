import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRouter = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
];

moduleRouter.forEach((route) => {
    router.use(route.path, route.route)
});