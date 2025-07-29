/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { User } from "../modules/user/user.model";
import { envVars } from "./env.config";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        }, async (email: string, password: string, done) => {
            try {
                const isExistUser = await User.findOne({ email });

                if (!isExistUser) {
                    return done("User does not exist");
                };

                // if (!isExistUser.isVerified) {
                //     return done("User is not verified");
                // };

                if (isExistUser.isBlocked === "Blocked" || isExistUser.isBlocked === "Inactive") {
                    return done(`User is ${isExistUser.isBlocked}`);
                };

                if (isExistUser.isDelete) {
                    return done("User is deleted");
                };

                const isGoogleAuthenticated = isExistUser.auths.some(providerObjects => providerObjects.provider == "google");

                if (isGoogleAuthenticated && !isExistUser.password) {
                    // return done(null, false, { message: "You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings." })
                    return done("You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings.")
                };

                const isMatchPassword = await bcrypt.compare(
                    password as string,
                    isExistUser.password as string
                );

                if (!isMatchPassword) {
                    return done("Incorrect password")
                };

                return done(null, isExistUser);
            } catch (error) {
                done(error);
            }
        }));

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile?.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "Not email found" });
                };

                let isExistUser = await User.findOne({ email });

                if (isExistUser && !isExistUser.isVerified) {
                    return done(null, false, { message: "User is not verified" });
                };

                if (isExistUser && isExistUser.isBlocked === "Blocked" || isExistUser && isExistUser.isBlocked === "Inactive") {
                    return done(null, false, { message: `User is ${isExistUser.isBlocked}` });
                };

                if (isExistUser && isExistUser.isDelete) {
                    return done(null, false, { message: "User is deleted" });
                };

                if (!isExistUser) {
                    isExistUser = await User.create({
                        name: profile.displayName,
                        email,
                        picture: profile.photos?.[0].value,
                        role: "Receiver",
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                };

                return done(null, isExistUser);
            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error);
            }
        }
    ));

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});