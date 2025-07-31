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
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnected = exports.redisClient = void 0;
/* eslint-disable no-console */
const redis_1 = require("redis");
const env_config_1 = require("./env.config");
exports.redisClient = (0, redis_1.createClient)({
    username: 'default',
    password: env_config_1.envVars.REDIS.REDIS_PASSWORD,
    socket: {
        host: env_config_1.envVars.REDIS.REDIS_HOST,
        port: Number(env_config_1.envVars.REDIS.REDIS_PORT)
    }
});
exports.redisClient.on('error', err => console.log('Redis Client Error', err));
const redisConnected = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.redisClient.isOpen) {
        yield exports.redisClient.connect();
        console.log('Redis connected successfully!');
    }
    ;
});
exports.redisConnected = redisConnected;
