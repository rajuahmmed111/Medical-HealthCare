import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, path.join(process.cwd(), ));
  },
  filename: function (req, file, cd) {
    cd(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const profileImage = upload.single("profileImage");

export const uploadFile = {
  upload,
  profileImage,
};
