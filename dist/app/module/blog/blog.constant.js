export const blogSearchableFields = ["title", "content", "author.name"];
export const blogFilterableFields = [
    "authorId",
    "createdAt",
    "updatedAt",
    "author.name",
    "author.email",
];
export const blogIncludeConfig = {
    author: true,
};
