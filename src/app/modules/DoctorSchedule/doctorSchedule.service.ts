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

// get all doctor schedule
const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, skip } = calculatedPagination(options);

  const filters: Prisma.DoctorScheduleWhereInput[] = [];

  if (searchTerm) {
    filters.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    filters.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const where: Prisma.DoctorScheduleWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const result = await prisma.doctorSchedule.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });

  const total = await prisma.doctorSchedule.count({
    where,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get my schedule
const getMySchedule = async (
  email: string,
  params: any,
  options: IPaginationOptions
) => {
  const { startDate, endDate, ...filterData } = params;
  const { limit, page, skip, sortBy, sortOrder } =
    calculatedPagination(options);

  const filters: Prisma.DoctorScheduleWhereInput[] = [];

  // filter on date
  if (startDate && endDate) {
    filters.push({
      schedule: {
        AND: [
          {
            startDateTime: {
              gte: startDate,
            },
          },
          {
            endDateTime: {
              lte: endDate,
            },
          },
        ],
      },
    });
  }

  // Exact search filter
  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }

    filters.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const where: Prisma.DoctorScheduleWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const result = await prisma.doctorSchedule.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
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

// delete Schedule
const deleteSchedule = async (DoctorEmail: string, scheduleId: string) => {
  // find doctor
  const doctorInfo = await prisma.doctor.findUnique({
    where: {
      email: DoctorEmail,
      isDeleted: false,
    },
  });
  if (!doctorInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  // isBooked schedule
  const isBookedSchedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: doctorInfo.id,
      scheduleId,
      isBooked: true,
    },
  });
  if (isBookedSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can not delete the schedule because of the schedule is already booked!"
    );
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorInfo.id,
        scheduleId,
      },
    },
  });

  return result;
};

export const DoctorScheduleService = {
  createDoctorSchedule,
  getAllFromDB,
  getMySchedule,
  deleteSchedule,
};
