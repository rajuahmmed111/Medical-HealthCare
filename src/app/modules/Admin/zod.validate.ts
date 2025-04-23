import { z } from "zod";

const updateAdmin = z.object({
  body: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const AdminValidation = {
  updateAdmin,
};
