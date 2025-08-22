"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const otpCode_route_1 = require("../modules/otpCode/otpCode.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
const contact_route_1 = require("../modules/contact/contact.route");
exports.router = (0, express_1.Router)();
const moduleRouter = [
    {
        path: "/user",
        route: user_route_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes
    },
    {
        path: "/otp",
        route: otpCode_route_1.OtpRoutes
    },
    {
        path: "/parcels",
        route: parcel_route_1.parcelRoutes
    },
    {
        path: "/contact",
        route: contact_route_1.contactRoutes
    },
];
moduleRouter.forEach((route) => {
    exports.router.use(route.path, route.route);
});
