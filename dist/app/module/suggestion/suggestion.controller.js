import { prisma } from "../../lib/prisma.js";
export const suggestionController = async (req, res) => {
    // Extract query parameter safely
    let query = req.query.q;
    if (Array.isArray(query))
        query = query[0]; // take first if array
    const searchTerm = typeof query === "string" ? query.trim() : "";
    if (!searchTerm || searchTerm.length < 2) {
        return res.json({ suggestions: [] });
    }
    const suggestions = await prisma.idea.findMany({
        where: {
            title: {
                contains: searchTerm,
                mode: "insensitive", // case-insensitive (PostgreSQL, MySQL 8+)
            },
            status: "APPROVED",
        },
        select: { id: true, title: true, solution: true, description: true },
        take: 10,
    });
    res.json({ suggestions });
};
