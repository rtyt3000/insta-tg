import {dispatcher} from "./instagram-polling";
import {bot, logger, env} from "./config";
import {handlers} from "./handlers";

dispatcher.start(env.MONITORING_USERNAME)
logger.info("Polling started")

bot
    .use(handlers)

bot.start()
logger.info("Bot started!")
