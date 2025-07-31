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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../modules/user/user.model");
const env_config_1 = require("./env.config");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExistUser = yield user_model_1.User.findOne({ email });
        if (!isExistUser) {
            return done("User does not exist");
        }
        ;
        // if (!isExistUser.isVerified) {
        //     return done("User is not verified");
        // };
        if (isExistUser.isBlocked === "Blocked" || isExistUser.isBlocked === "Inactive") {
            return done(`User is ${isExistUser.isBlocked}`);
        }
        ;
        if (isExistUser.isDelete) {
            return done("User is deleted");
        }
        ;
        const isGoogleAuthenticated = isExistUser.auths.some(providerObjects => providerObjects.provider == "google");
        if (isGoogleAuthenticated && !isExistUser.password) {
            // return done(null, false, { message: "You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings." })
            return done("You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings.");
        }
        ;
        const isMatchPassword = yield bcryptjs_1.default.compare(password, isExistUser.password);
        if (!isMatchPassword) {
            return done("Incorrect password");
        }
        ;
        return done(null, isExistUser);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_config_1.envVars.GOOGLE.GOOGLE_CLIENT_ID,
    clientSecret: env_config_1.envVars.GOOGLE.GOOGLE_CLIENT_SECRET,
    callbackURL: env_config_1.envVars.GOOGLE.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "Not email found" });
        }
        ;
        let isExistUser = yield user_model_1.User.findOne({ email });
        if (isExistUser && !isExistUser.isVerified) {
            return done(null, false, { message: "User is not verified" });
        }
        ;
        if (isExistUser && isExistUser.isBlocked === "Blocked" || isExistUser && isExistUser.isBlocked === "Inactive") {
            return done(null, false, { message: `User is ${isExistUser.isBlocked}` });
        }
        ;
        if (isExistUser && isExistUser.isDelete) {
            return done(null, false, { message: "User is deleted" });
        }
        ;
        if (!isExistUser) {
            isExistUser = yield user_model_1.User.create({
                name: profile.displayName,
                email,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: "Receiver",
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id
                    }
                ]
            });
        }
        ;
        return done(null, isExistUser);
    }
    catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
