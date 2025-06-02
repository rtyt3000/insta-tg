import { IgApiClient } from "instagram-private-api";

export async function getPostMedia(ig: IgApiClient,postId: string): Promise<Array<string>> {
        const mediaInfo = await ig.media.info(postId);
        const item = mediaInfo.items[0];

        if (item.media_type === 1) 
            return [item.image_versions2?.candidates?.[0]?.url];
        else if (item.media_type === 2) 
            return [(item as any).video_versions?.[0]?.url];
        else if (item.media_type === 8) {
        return (item as any).carousel_media?.map((media: any) => {
            if (media.media_type === 1)
                return media.image_versions2?.candidates?.[0]?.url;
            else if (media.media_type === 2) 
                return media.video_versions?.[0]?.url;
            });
        }
        return [];
    }