import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";

// create schedule
const createSchedule = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const schedules = [];
  const intervalTime = 30;

  const currentDate = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      )
    );

    const endDataTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );


    // separate schedule slot
    while (startDateTime < endDataTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };

      // create schedule
      const result = await prisma.schedule.create({
        data: scheduleData,
      });
      schedules.push(result);

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

export const ScheduleService = {
  createSchedule,
};
