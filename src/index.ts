import {dispatcher} from "./instagram-polling";
import {bot, logger} from "./config";
import {handlers} from "./handlers";

dispatcher.start("rtyt.4000")
logger.info("Polling started")

bot
    .use(handlers)

bot.start()
logger.info("Bot started!")
