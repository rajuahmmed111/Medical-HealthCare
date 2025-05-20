import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import { IPaginationOptions } from "../../../Interface/common";
import { calculatedPagination } from "../../../Helpers/calculatePagination";
import { Prisma, UserRole } from "@prisma/client";

const createAppointment = async (patientEmail: string, payload: any) => {
  const { doctorId, scheduleId } = payload;

  // validation patient
  const patientData = await prisma.patient.findUnique({
    where: {
      email: patientEmail,
      isDeleted: false,
    },
  });
  if (!patientData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }

  // validation doctor
  const doctorData = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });
  if (!doctorData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  // validation schedule
  const doctorScheduleData = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId,
      isBooked: false,
    },
  });
  if (!doctorScheduleData) {
    throw new ApiError(httpStatus.NOT_FOUND, "doctorSchedule not found");
  }

  // generate videoCallingID
  const videoCallingID: string = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    // create appointment
    const appointmentData = await prisma.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId,
        videoCallingID,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    // update schedule
    await prisma.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    // generate payment transaction id
    // ------> Medical-Health-Care ---> DateTime
    const today = new Date();
    const transactionId = `Medical-Health-Care-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;

    // create payment
    await prisma.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

// get my appointments
const getMyAppointments = async (
  user: any,
  params: any,
  options: IPaginationOptions
) => {
  const { ...filterData } = params;
  const { limit, page, skip } = calculatedPagination(options);

  const filters: Prisma.AppointmentWhereInput[] = [];

  // exact specific user email filter
  if (user?.role === UserRole.PATIENT) {
    filters.push({
      patient: {
        email: user?.email,
      },
    });
  } else {
    filters.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    filters.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const where: Prisma.AppointmentWhereInput =
    filters.length > 0
      ? {
          AND: filters,
        }
      : {};

  const result = await prisma.appointment.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },

    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : { patient: { include: { medicalReport: true, patientHealthData: true } }, schedule: true }
  });

  const total = await prisma.appointment.count({ where });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const AppointmentService = {
  createAppointment,
  getMyAppointments,
};
