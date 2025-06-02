import { InstagramDispatcher } from "./client";
import {bot, env, logger, translator} from "../config";
import {UserFeedResponseItemsItem} from "instagram-private-api";
import {
    InputMediaAudio,
    InputMediaDocument,
    InputMediaPhoto, InputMediaVideo
} from "grammy/out/types.node";
import {InputMediaBuilder} from "grammy";

export const dispatcher = new InstagramDispatcher(env.INSTAGRAM_NICKNAME, env.INSTAGRAM_PASSWORD);

const getMediaFromPost = (post: UserFeedResponseItemsItem) =>{
    const links = { images: [] as string[], videos: [] as string[] };

    if (post.image_versions2) {
        links.images.push(...post.image_versions2.candidates.map(c => c.url));
    }

    if (post.video_versions) {
        links.videos.push(...post.video_versions.map(v => v.url));
    }
    return links;
}

dispatcher.onNewPost(async (ig, caption, media, type) => {
    let tgPostCaption: string | undefined;

    
    if (media.length == 0)
        return logger.warn("Post has no media, skipping");

    if (caption) 
        tgPostCaption = (await translator.translateText(caption, null, "ru")).text;

    logger.info("New post with media", {media});

    if (type === 1) {
        logger.info("Sending photo");
        await bot.api.sendPhoto(env.CHANNEL_ID, media[0], {caption: tgPostCaption});
    } else if (type === 2) {
        logger.info("Sending video");
        await bot.api.sendVideo(env.CHANNEL_ID, media[0], {caption: tgPostCaption});
    } else if (type === 8) {
        logger.info("Sending media group");
        const input: (InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo)[] = [];
        media.forEach((img) => {
            input.push(InputMediaBuilder.photo(img));
        })
        input[0].caption = tgPostCaption;

        await bot.api.sendMediaGroup(env.CHANNEL_ID, input );

    }
})
