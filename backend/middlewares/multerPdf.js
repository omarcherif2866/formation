// import multer, { diskStorage } from "multer";
// import { join, dirname, extname } from "path";
// import { fileURLToPath } from "url";

// const MIME_TYPES = {
//   "application/pdf": "pdf",

// };

// export default function (pdf) {
//   return multer({
//     storage: diskStorage({
//       destination: (req, file, callback) => {
//         const __dirname = dirname(fileURLToPath(import.meta.url));
//         callback(null, join(__dirname, "../public/pdfs"));
//       },
//       filename: (req, file, callback) => {
//         const name = file.originalname.split(" ").join("_");
//         const extension = MIME_TYPES[file.mimetype]; // Get the file extension based on MIME type
//         callback(null, name + '-' + Date.now() + '.' + extension); // Append the extension to the filename
//       },
//     }),
//   }).single(pdf);
// }

import multer from 'multer';
import { extname, join } from 'path';
const MIME_TYPES = {
  "application/pdf": "pdf",

};
const destination = join(process.cwd(), 'public', 'pdfs');

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + extension); // Append the extension to the filename
}
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Seuls les fichiers PDF sont autorisés'));
    }
    cb(null, true);
  }
});

export default upload;

