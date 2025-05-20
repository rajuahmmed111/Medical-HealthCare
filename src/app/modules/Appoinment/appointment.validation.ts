import { z } from "zod";

const createAppointment = z.object({
  //   body: z.object({
  doctorId: z.string({
    required_error: "Doctor id is required",
  }),
  scheduleId: z.string({
    required_error: "Schedule id is required",
  }),
});
// });

export const AppointmentValidation = {
  createAppointment,
};
