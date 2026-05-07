import { prisma } from "../../lib/prisma.js";
const createcategory = async (payload) => {
    const category = await prisma.category.create({
        data: payload,
    });
    return category;
};
const getAllCategory = async () => {
    const category = await prisma.category.findMany();
    return category;
};
const getCategoryById = async (id) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
        },
    });
    return category;
};
const updateCategory = async (id, payload) => {
    const category = await prisma.category.update({
        where: {
            id,
        },
        data: payload,
    });
    return category;
};
const deleteCategory = async (id) => {
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
