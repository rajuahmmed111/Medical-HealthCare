import { Request } from "express";
import prisma from "../../../shared/prisma";

// create schedule
const createSchedule = async (req: Request) => {
    const result = await prisma.schedule.create({
        data: req.body,
    });
    return result;
};

export const ScheduleService = {
    createSchedule,
};