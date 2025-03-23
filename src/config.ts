import {z} from 'zod';
import {Logger} from "@origranot/ts-logger";
import {Bot, Context} from "grammy";

export const env = z.object({
    INSTAGRAM_NICKNAME: z.string(),
    INSTAGRAM_PASSWORD: z.string(),
    TELEGRAM_TOKEN: z.string(),
    CHANNEL_ID: z.string(),
    CHAT_ID: z.string(),
}).parse(process.env);

export const logger = new Logger();

export type BotContext = Context;

export const bot = new Bot<BotContext>(env.TELEGRAM_TOKEN);