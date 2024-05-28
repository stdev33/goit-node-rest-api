import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: function (req, file, callback) {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    callback(null, `${file.fieldname}_${uniqueSuffix}_${file.originalname}`);
  },
});

const limits = {
  fileSize: 1024 * 256,
};

const upload = multer({ storage: storage, limits });

export default upload;
