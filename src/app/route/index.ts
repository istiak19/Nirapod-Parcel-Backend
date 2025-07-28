import { Router } from "express";

export const router = Router();

const moduleRouter = [
    {
        path: "/user",
        route: "route"
    }
];

moduleRouter.forEach((route) => {
    router.use(route.path, route.route)
});