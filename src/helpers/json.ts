export const initJson = async () => 
    await Bun.write("posts.json", JSON.stringify({ posts: [] }));

export const readJson = async () => {
    let file = Bun.file("posts.json");
    if (!(await file.exists())) {
        await initJson();
        file = Bun.file("posts.json");
    }
    const content = await file.text();
    return JSON.parse(content);
}

export const isInDatabase = async (postId: string): Promise<boolean> => {
    const data = await readJson();
    return data.posts[data.posts.length - 1].id === postId
}
export const addToDatabase = async (postId: string) => {
    const data = await readJson();
    data.posts.push({ id: postId });
    await Bun.file("posts.json").write(JSON.stringify(data, null, 2));
}