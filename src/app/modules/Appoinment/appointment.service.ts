import prisma from "../../../shared/prisma";

const createAppointment = async (payload: any) => {
    const result = await prisma.appointment.create({
        data: payload,
    });
    return result;
};

export const AppointmentService = {
    createAppointment,
};