import {
    IgApiClient, UserFeedResponseItemsItem
} from "instagram-private-api";
import {logger} from "../config";
import { getPostMedia } from "../helpers";

export class InstagramDispatcher {
    password: string;
    username: string;
    ig: IgApiClient;
    newPostHandler: (
        ig: IgApiClient,
        caption: string | undefined, 
        media: Array<string>, 
        type: number
    ) => Promise<void>;

    constructor (username: string, password: string) {
        this.username = username;
        this.password = password;
        this.ig = new IgApiClient();
        this.ig.state.generateDevice(username);

        this.newPostHandler = async () => {};
    }

    onNewPost = (handler: (ig: IgApiClient, caption: string | undefined, media: Array<string>, type: number) => Promise<void>) =>
        this.newPostHandler = handler;

    getLatestPost = async (username: string) => {
        const userId = await this.ig.user.getIdByUsername(username);
        const userFeed = this.ig.feed.user(userId);

        const posts = await userFeed.items();

        return posts[0]
    }

    start = async (username: string, interval: number = 60000) => {
        try {
            await this.ig.account.login(this.username, this.password);

            let lastPost = await this.getLatestPost(username);
            if (lastPost) {
                logger.info(`Last post id: ${lastPost.id}`);
            }

            setInterval(async () => {
                const newPost = await this.getLatestPost(username);
                if (newPost) {
                    if (lastPost) {
                        if (newPost.id !== lastPost.id) {
                            await this.newPostHandler(this.ig, newPost.caption?.text, await getPostMedia(this.ig, newPost.id), newPost.media_type);
                            lastPost = newPost;
                        }
                    } else {
                        await this.newPostHandler(this.ig, newPost.caption?.text, await getPostMedia(this.ig, newPost.id), newPost.media_type);
                        lastPost = newPost;
                    }
                }
            }, interval);
        } catch (IgLoginRequiredError)  {
            await this.ig.account.login(this.username, this.password);
        }
    }

}