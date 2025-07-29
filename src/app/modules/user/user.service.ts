import bcrypt from "bcryptjs";
import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    const isExist = await User.findOne({ email });
    if (isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "A user with this email already exists.");
    };

    const hashPassword = await bcrypt.hash(password as string, 10);

    const auth: IAuthProvider = {
        provider: "credentials",
        providerId: email as string
    };

    const user = await User.create({
        email,
        hashPassword,
        auths: [auth],
        ...rest
    });

    return user;
};

export const userService = {
    createUser
};