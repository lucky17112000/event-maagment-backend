import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interface/query.interface";
import { QueryBuilder } from "../../utiles/QueryBuilder";
import { Prisma, User } from "../../../generated/prisma/client";

const getAllUsersByAdmn = async (
  user: IRequestUser,
  query: IQueryParams = {},
) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }

  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { role: true },
  });

  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }

  const normalizedQuery: IQueryParams = { ...query };

  const queryBuilder = new QueryBuilder<User>(prisma.user, normalizedQuery, {
    searchableFields: ["email", "id"],
    filterableFields: ["createdAt", "updatedAt", "role"],
  });

  const result = await queryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({
      _count: {
        select: {
          ideas: true,
          feedbacks: true,
          votes: true,
          payments: true,
          purchases: true,
        },
      },
    })
    .execute();

  return result;
};
const updateUserRoleByAdmin = async (
  userId: string,
  role: string,
  user: IRequestUser,
) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (userData.email === user.email) {
    throw new AppError(status.BAD_REQUEST, "You cannot change your own role");
  }
  const result = await prisma.user.update({
    where: { id: userId },
    data: { role: role as "USER" | "ADMIN" },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const getOneUserByAdmin = async (userId: string, user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  return result;
};

const softDeleteUserByAdmin = async (userId: string, user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (userData.email === user.email) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot delete your own account",
    );
  }
  const result = await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true, deletedAt: new Date() },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      isDeleted: true,
      deletedAt: true,
    },
  });
  return result;
};

const hardDeleteUserByAdmin = async (userId: string, user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (userData.email === user.email) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot delete your own account",
    );
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return { message: "User deleted successfully" };
};
//get user cout , admi count, idividual category idea count voye count by admin
const getAdminDashboardStats = async (user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  // const chkAdmin = await prisma.user.findUnique({
  //   where: { id: user.userId },
  // });
  // if (chkAdmin?.role !== "ADMIN") {
  //   throw new AppError(
  //     status.FORBIDDEN,
  //     "Only admins can access this resource",
  //   );
  // }
  const totalUsers = await prisma.user.count({
    where: { role: "USER" },
  });
  const totalAdmins = await prisma.user.count({
    where: { role: "ADMIN" },
  });
  //Energy ,Plastic, Tree,Others
  // const totalEnergyIdeas = await prisma.idea.count({
  //   where: { category: { name: "" } },
  // });
  const totalFitnessWorkshop = await prisma.idea.count({
    where: { category: { name: "Fitness Workshop" } },
  });
  // const totalPlasticIdeas = await prisma.idea.count({
  //   where: { category: { name: "Plastic" } },
  // });
  //total hacakaton
  const totalHacakaton = await prisma.idea.count({
    where: { category: { name: "Hackaton" } },
  });
  //total Fashion Show
  const totalFashionShow = await prisma.idea.count({
    where: { category: { name: "Fashion Show" } },
  });
  // total Webiner
  const totalWebiner = await prisma.idea.count({
    where: { category: { name: "Webiner" } },
  });
  // total Music Concert
  const totalMusicConcert = await prisma.idea.count({
    where: { category: { name: "Music Concert" } },
  });
  // total Seminaer
  const totalSeminaer = await prisma.idea.count({
    where: { category: { name: "Seminaer" } },
  });
  // Marrige Ceremony
  const totalMarrigeCeremony = await prisma.idea.count({
    where: { category: { name: "Marrige Ceremony" } },
  });
  // Art Exhibition
  const totalArtExhibition = await prisma.idea.count({
    where: { category: { name: "Art Exhibition" } },
  });
  // Conference
  const totalConference = await prisma.idea.count({
    where: { category: { name: "Conference" } },
  });
  // Science Fair
  const totalScienceFair = await prisma.idea.count({
    where: { category: { name: "Science Fair" } },
  });
  //  Workshop
  const totalWorkshop = await prisma.idea.count({
    where: { category: { name: "Workshop" } },
  });
  // Sports Tournament
  const totalSportsTournament = await prisma.idea.count({
    where: { category: { name: "Sports Tournament" } },
  });

  return {
    totalUsers,
    totalAdmins,
    totalFitnessWorkshop,
    totalHacakaton,
    totalFashionShow,
    totalWebiner,
    totalMusicConcert,
    totalSeminaer,
    totalMarrigeCeremony,
    totalArtExhibition,
    totalConference,
    totalScienceFair,
    totalWorkshop,
    totalSportsTournament,
  };
};
//individual user idea count, approved idea count, total vote count catcjh by user
const getIndividualUserStats = async (user: IRequestUser) => {
  //dont need to check role because user can access their own stats
  const totalIdeas = await prisma.idea.count({
    where: { authorId: user.userId },
  });
  const approvedIdeas = await prisma.idea.count({
    where: { authorId: user.userId, status: "APPROVED" },
  });
  const totalVotes = await prisma.vote.count({
    where: { userId: user.userId },
  });
  const totalUpVotes = await prisma.vote.count({
    where: { userId: user.userId, type: "UP" },
  });
  const totalDownVotes = await prisma.vote.count({
    where: { userId: user.userId, type: "DOWN" },
  });
  return {
    totalIdeas,
    approvedIdeas,
    totalVotes,
    totalUpVotes,
    totalDownVotes,
  };
};

export const adminService = {
  getAllUsersByAdmn,
  updateUserRoleByAdmin,
  getOneUserByAdmin,
  softDeleteUserByAdmin,
  // getDeletedUsersByAdmin,
  hardDeleteUserByAdmin,
  getAdminDashboardStats,
  getIndividualUserStats,
};
