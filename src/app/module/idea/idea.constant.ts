import { Prisma } from "../../../generated/prisma/client";

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

export const ideaIncludeConfig: Partial<
  Record<keyof Prisma.IdeaInclude, Prisma.IdeaInclude[keyof Prisma.IdeaInclude]>
> = {
  author: true,
  category: true,
  votes: true,
  feedback: true,
  purchases: true,
};
