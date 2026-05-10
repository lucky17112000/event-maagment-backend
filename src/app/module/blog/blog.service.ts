import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { ICreateBlogPayload } from "./blog.interface";
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interface/query.interface";
import { QueryBuilder } from "../../utiles/QueryBuilder";
import { Blog, Prisma } from "../../../generated/prisma/client";
import {
  blogFilterableFields,
  blogIncludeConfig,
  blogSearchableFields,
} from "./blog.constant";

const createBlog = async (payload: ICreateBlogPayload, user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(status.FORBIDDEN, "Only admin can create a blog");
  }
  const result = await prisma.blog.create({
    data: {
      title: payload.title,
      content: payload.content,
      authorId: payload.authorId,
      Image: payload?.image,
    },
    include: {
      author: true,
    },
  });
  return result;
};

const getAllBlogs = async (query: IQueryParams) => {
  const normalizedQuery: IQueryParams = { ...query };
  const searchTerm = normalizedQuery.searchTerm?.trim();
  if (searchTerm && !Number.isNaN(Number(searchTerm))) {
    normalizedQuery.price = searchTerm;
    delete normalizedQuery.searchTerm;
  }

  const queryBuilder = new QueryBuilder<
    Blog,
    Prisma.BlogWhereInput,
    Prisma.BlogInclude
  >(prisma.blog, normalizedQuery, {
    searchableFields: blogSearchableFields,
    filterableFields: blogFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .sort()
    .include({ author: true })
    .dynamicInclude(blogIncludeConfig)
    .execute();
  return result;
};

const deleteBlog =  async(id: string , user: IRequestUser) => {
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admin can delete a blog");
    }
    const blog = await prisma.blog.findUnique({
        where: { id },
    });
    if (!blog) {
        throw new AppError(status.NOT_FOUND, "Blog not found");
    }
    await prisma.blog.delete({
        where: { id },
    });
    return;
}

export const BlogService = {
  createBlog,
  getAllBlogs,
  deleteBlog,
};
