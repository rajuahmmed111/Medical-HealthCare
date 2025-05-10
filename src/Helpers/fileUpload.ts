import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryUploadResponse, IUploadedFile } from "../Interface/file";

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cd) {
    cd(null, file.originalname);
  },
});

// Configuration
cloudinary.config({
  cloud_name: "dugcllznd",
  api_key: "298919725832732",
  api_secret: "KQbyyHWCgDOc1uhDgWa1Wl-3bsg",
});

const upload = multer({ storage: storage });

const profileImage = upload.single("profileImage");
const specialtiesIcon = upload.single("specialtiesIcon");

const uploadToCloudinary = async (
  file: IUploadedFile
): Promise<ICloudinaryUploadResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      // {public_id: file.originalname},
      (error: Error, result: ICloudinaryUploadResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const uploadFile = {
  upload,
  profileImage,
  specialtiesIcon,
  uploadToCloudinary,
};
