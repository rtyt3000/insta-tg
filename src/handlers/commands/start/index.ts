import {Composer} from "grammy";
import {BotContext} from "../../../config";

export const commandStart = new Composer<BotContext>()

commandStart.command('start', async (ctx) => {
    await ctx.reply("Привет! Этот бот отправляет посты из инстаграма в телеграм канал!")
})