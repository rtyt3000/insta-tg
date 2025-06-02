import {
    IgApiClient, UserFeedResponseItemsItem
} from "instagram-private-api";
import {logger} from "../config";
import { getPostMedia, isInDatabase, addToDatabase } from "../helpers";

export class InstagramDispatcher {
    password: string;
    username: string;
    ig: IgApiClient;
    newPostHandler: (
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

    onNewPost = (handler: (caption: string | undefined, media: Array<string>, type: number) => Promise<void>) =>
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
            this.polling(username);
            
            setInterval(() => this.polling(username), interval);
        } catch (IgLoginRequiredError)  {
            await this.ig.account.login(this.username, this.password);
        }
    }

    polling = async (username: string) => {
        const post = await this.getLatestPost(username);
        if (!post) return
                
        if (!await isInDatabase(post.id)) {
            await addToDatabase(post.id);
            await this.newPostHandler(post.caption?.text, await getPostMedia(this.ig, post.id), post.media_type);
        }
    }
}