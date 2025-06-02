import {z} from 'zod';
import {Logger} from "@origranot/ts-logger";
import {Bot} from "grammy";
import {Translator} from "deepl-node";
import { configDotenv } from 'dotenv';
import {BotContext} from "./types";

configDotenv();

// Define the environment variables schema
export const env = z.object({
    INSTAGRAM_NICKNAME: z.string(),
    INSTAGRAM_PASSWORD: z.string(),
    DEEPL_KEY: z.string(),
    TELEGRAM_TOKEN: z.string(),
    CHANNEL_ID: z.string(),
    MONITORING_USERNAME: z.string(),
}).parse(process.env);

export const logger = new Logger();
export const translator = new Translator(env.DEEPL_KEY);

export const bot = new Bot<BotContext>(env.TELEGRAM_TOKEN);