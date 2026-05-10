import { Prisma } from "../../../generated/prisma/client";

export const blogSearchableFields = ["title", "content", "author.name"];

export const blogFilterableFields = [
  "authorId",
  "createdAt",
  "updatedAt",
  "author.name",
  "author.email",
];
export const blogIncludeConfig: Partial<
  Record<keyof Prisma.BlogInclude, Prisma.BlogInclude[keyof Prisma.BlogInclude]>
> = {
  author: true,
};
