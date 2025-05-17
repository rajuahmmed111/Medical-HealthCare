import prisma from "../../../shared/prisma";

// create schedule
const createSchedule = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  console.log(payload);

  // 

};

export const ScheduleService = {
  createSchedule,
};
