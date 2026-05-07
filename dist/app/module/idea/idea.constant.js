export const ideaSearchableFields = [
    "title",
    "problemStatement",
    "solutinon",
    "description",
    "category.name",
];
export const ideaFilterableFields = [
    "categoryId",
    "isPaid",
    "price",
    "authorId",
    "createdAt",
    "updatedAt",
    "isDeleted",
    "deletedAt",
    "status",
    "author.name",
    "author.email",
];
export const ideaIncludeConfig = {
    author: true,
    category: true,
    votes: true,
    feedback: true,
    purchases: true,
};
