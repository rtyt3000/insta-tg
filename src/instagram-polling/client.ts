import {
    IgApiClient, UserFeedResponseItemsItem
} from "instagram-private-api";
import {logger} from "../config";

export class InstagramDispatcher {
    password: string;
    username: string;
    ig: IgApiClient;
    newPostHandler: (post: UserFeedResponseItemsItem) => Promise<void>;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.ig = new IgApiClient();
        this.ig.state.generateDevice(username);

        this.newPostHandler = async () => {};
    }

    onNewPost(handler: (post: UserFeedResponseItemsItem) => Promise<void>) {
        this.newPostHandler = handler;
    }

    async getLatestPost(username: string) {

        const userId = await this.ig.user.getIdByUsername(username);

        const userFeed = this.ig.feed.user(userId);
        const posts = await userFeed.items();

        return posts[0]
    }

    async start(username: string, interval: number = 60000) {
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
                            await this.newPostHandler(newPost);
                            lastPost = newPost;
                        }
                    } else {
                        await this.newPostHandler(newPost);
                        lastPost = newPost;
                    }
                }
            }, interval);
        } catch (IgLoginRequiredError)  {
            await this.ig.account.login(this.username, this.password);
        }
    }
}