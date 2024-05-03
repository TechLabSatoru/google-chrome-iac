
export async function applyGCIaC(jsonOutput) {

    await removeAllBookmarks();

    await createBookmarks(jsonOutput);

}

async function removeAllBookmarks() {

    let bookmarksTree = await chrome.bookmarks.getTree();

    for (let i = 0; i < bookmarksTree.length; i++) {
        await deleteBookmarkNode(bookmarksTree[i]);
    }

}

async function deleteBookmarkNode(node) {

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            await deleteBookmarkNode(node.children[i]);
        }
    }

    /* "Bookmarks" and "Other Bookmarks" id are 1 or 2  */
    if (node.id && (node.unmodifiable !== true) && node.id > 10) {
        try {
            await chrome.bookmarks.removeTree(node.id);
        } catch (error) {
            console.error(`Failed to delete bookmark ${node.id}:`, error);
        }
    }

}

async function createBookmarks(jsonOutput) {

    const tree = await chrome.bookmarks.getTree();
    const bookmarkBarId = tree[0].children[0].id;

    await createItems(jsonOutput, bookmarkBarId);
}

async function createItems(items, parentId) {

    for (const item of items) {

        if (item.type === "folder") {

            const folder = await chrome.bookmarks.create({
                parentId: parentId,
                title: item.name
            });

            if (item.items) {
                await createItems(item.items, folder.id);
            }

        } else if (item.type === "file") {
            await chrome.bookmarks.create({
                parentId: parentId,
                title: item.name,
                url: item.link
            });
        }

    }

}

