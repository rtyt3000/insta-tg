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

dispatcher.onNewPost(async (post) => {
    let tgPostCaption: string | undefined;

    if (post.caption) {
        tgPostCaption = (await translator.translateText(post.caption.text, null, "ru")).text;
    }

    const media = getMediaFromPost(post);
    logger.info("New post with media", {media});

    if (media.images.length == 1 && media.videos.length == 0) {
        logger.info("Sending photo");
        await bot.api.sendPhoto(env.CHANNEL_ID, media.images[0], {caption: tgPostCaption});
    } else if (media.videos.length == 1 && media.images.length == 0) {
        logger.info("Sending video");
        await bot.api.sendVideo(env.CHANNEL_ID, media.videos[0], {caption: tgPostCaption});
    } else if (media.images.length > 1 || media.videos.length > 1) {
        logger.info("Sending media group");
        const input: (InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo)[] = [];
        media.images.forEach((img) => {
            input.push(InputMediaBuilder.photo(img));
        })
        media.videos.forEach((vid) => {
            input.push(InputMediaBuilder.video(vid));
        })
        input[0].caption = tgPostCaption;

        await bot.api.sendMediaGroup(env.CHANNEL_ID, input );

    }
})
