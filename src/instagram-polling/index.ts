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

dispatcher.onNewPost(async (caption, media, type) => {
    let tgPostCaption: string | undefined;

    
    if (media.length == 0)
        return logger.warn("Post has no media, skipping");

    if (caption) tgPostCaption = 
    `От автора:<blockquote>${(await translator.translateText(caption, null, "ru")).text}</blockquote>`
    
    logger.info("New post with media", {media});

    if (type === 1) {
        logger.info("Sending photo");
        await bot.api.sendPhoto(env.CHANNEL_ID, media[0], {
            caption: tgPostCaption,
            parse_mode: "HTML"
        });
    } else if (type === 2) {
        logger.info("Sending video");
        await bot.api.sendVideo(env.CHANNEL_ID, media[0], {
            caption: tgPostCaption,
            parse_mode: "HTML"
        });
    } else if (type === 8) {
        logger.info("Sending media group");
        const input: (InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo)[] = [];
        media.forEach((img) => {
            input.push(InputMediaBuilder.photo(img));
        })
        input[0].caption = tgPostCaption;
        input[0].parse_mode = "HTML";

        await bot.api.sendMediaGroup(env.CHANNEL_ID, input );

    }
})
