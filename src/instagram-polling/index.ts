import { InstagramDispatcher } from "./client";
import {env, logger} from "../config";

export const dispatcher = new InstagramDispatcher(env.INSTAGRAM_NICKNAME, env.INSTAGRAM_PASSWORD);

dispatcher.onNewPost(async (post) => {
    logger.info(post.caption?.text ?? "No caption");
})
