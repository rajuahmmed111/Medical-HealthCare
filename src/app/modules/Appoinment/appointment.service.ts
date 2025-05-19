import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

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
  const videoCallingID = uuidv4();

  // create appointment
  const appointment = await prisma.appointment.create({
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
    }
  });

  return appointment;
};

export const AppointmentService = {
  createAppointment,
};
