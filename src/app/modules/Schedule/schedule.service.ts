import httpStatus from "http-status";
import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import ApiError from "../../../Error/apiError";
import { Prisma, Schedule } from "@prisma/client";
import { ISchedulePayload } from "./schedule.interface";
import { IPaginationOptions } from "../../../Interface/common";
import { calculatedPagination } from "../../../Helpers/calculatePagination";

// create schedule
const createSchedule = async (
  payload: ISchedulePayload
): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const schedules = [];
  const intervalTime = 30;

  const currentDate = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    // 09:30 ------> ['09', '30']
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDataTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    // separate schedule slot
    while (startDateTime < endDataTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };

      // check schedule already exist
      const checkSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });
      // not throw error , because when you throw error it will stop the loop

      // create schedule
      if (!checkSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

// get all schedule
const getAllFromDB = async (
  params: any,
  options: IPaginationOptions
): Promise<Schedule[]> => {
  const { startDate, endDate, ...filterData } = params;
  const { limit, page, skip, sortBy, sortOrder } =
    calculatedPagination(options);

  const filters: Prisma.ScheduleWhereInput[] = [];

  // filter on date
  if (startDate && endDate) {
    filters.push({
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
    });
  }

  // Exact search filter
  if (Object.keys(filterData).length > 0) {
    filters.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const where: Prisma.ScheduleWhereInput = { AND: filters };

  const result = await prisma.schedule.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "asc",
          },
  });

  // if (result.length === 0) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "Schedule not found");
  // }

  const total = await prisma.schedule.count({ where });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const ScheduleService = {
  createSchedule,
  getAllFromDB,
};
