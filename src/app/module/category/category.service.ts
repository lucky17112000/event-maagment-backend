import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";

const createcategory = async (payload: ICategory) => {
  const category = await prisma.category.create({
    data: payload,
  });
  return category;
};

const getAllCategory = async () => {
  const category = await prisma.category.findMany();
  return category;
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  return category;
};

const updateCategory = async (id: string, payload: ICategory) => {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return category;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.delete({
    where: {
      id,
    },
  });
  return category;
};

export const categoryService = {
  createcategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
