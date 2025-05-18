import httpStatus from "http-status";
import ApiError from "../../../Error/apiError";
import prisma from "../../../shared/prisma";

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

export const DoctorScheduleService = {
  createDoctorSchedule,
};
