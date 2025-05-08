import { Admin, Doctor, Patient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { uploadFile } from "../../../Helpers/fileUpload";
import { IUploadedFile } from "../../../Interface/file";
import { Request } from "express";

// create admin
const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req.file as IUploadedFile;

  if (file) {
    const uploadToCloudinary = await uploadFile.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  // use transaction to create user and admin data
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const admin = await tx.admin.create({
      data: req.body.admin,
    });

    return admin;
  });

  return result;
};

// create doctor
const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file as IUploadedFile;

  if (file) {
    const uploadToCloudinary = await uploadFile.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  // use transaction to create user and doctor data
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const doctor = await tx.doctor.create({
      data: req.body.doctor,
    });

    return doctor;
  });

  return result;
};

// create patient
const createPatient = async (req: Request): Promise<Patient> => {
  const file = req.file as IUploadedFile;

  if (file) {
    const uploadToCloudinary = await uploadFile.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  // use transaction to create user and patient data
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const patient = await tx.patient.create({
      data: req.body.patient,
    });

    return patient;
  });

  return result;
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
};
