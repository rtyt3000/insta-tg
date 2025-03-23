import {z} from 'zod';
import {Logger} from "@origranot/ts-logger";
import {Bot, Context} from "grammy";
import {Translator} from "deepl-node";

export const env = z.object({
    INSTAGRAM_NICKNAME: z.string(),
    INSTAGRAM_PASSWORD: z.string(),
    DEEPL_KEY: z.string(),
    TELEGRAM_TOKEN: z.string(),
    CHANNEL_ID: z.string(),
    CHAT_ID: z.string(),
}).parse(process.env);

export const logger = new Logger();
export const translator = new Translator(env.DEEPL_KEY);

export type BotContext = Context;
export const bot = new Bot<BotContext>(env.TELEGRAM_TOKEN);