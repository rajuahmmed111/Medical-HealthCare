import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../Interface/common";
import { calculatedPagination } from "../../../Helpers/calculatePagination";
import { Prisma } from "@prisma/client";

const createDoctorSchedule = async (
  email: string,
  payload: {
    scheduleIds: string[];
  }
) => {
  //find doctor
  const doctorInfo = await prisma.doctor.findUnique({
    where: {
      email,
      isDeleted: false,
    },
  });

  if (!doctorInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const doctorScheduleData = payload?.scheduleIds.map((scheduleId: string) => ({
    doctorId: doctorInfo.id,
    scheduleId,
  }));

  const doctorSchedule = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });

  return doctorSchedule;
};

// get my schedule
const getMySchedule = async (
  email: string,
  params: any,
  options: IPaginationOptions
) => {
  const { startDateTime, endDateTime, ...filterData } = params;
  const { limit, page, skip, sortBy, sortOrder } =
    calculatedPagination(options);

  const filters: Prisma.DoctorScheduleWhereInput[] = [];

  // filter on date
  if (startDateTime && endDateTime) {
    filters.push({
      schedule: {
        AND: [
          {
            startDateTime: {
              gte: startDateTime,
            },
          },
          {
            endDateTime: {
              lte: endDateTime,
            },
          },
        ],
      },
    });
  }

  // Exact search filter
  if (Object.keys(filterData).length > 0) {
    filters.push({
      schedule: {
        AND: Object.keys(filterData).map((key) => ({
          [key]: {
            equals: filterData[key],
          },
        })),
      },
    });
  }

  const where: Prisma.DoctorScheduleWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const result = await prisma.doctorSchedule.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      scheduleId: "desc",
    },
  });

  const total = await prisma.doctorSchedule.count({ where });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const DoctorScheduleService = {
  createDoctorSchedule,
  getMySchedule,
};
