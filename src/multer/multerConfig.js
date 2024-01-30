const multer = require('multer')
const path = require("path");

// Configuración de Multer para guardar archivos en carpetas diferentes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (file.fieldname === 'profileImage') {
      folder = 'profiles';
    } else if (file.fieldname === 'productImage') {
      folder = 'products';
    } else {
      folder = 'documents';
    }

    const uploadPath = path.join(__dirname, "..", 'uploads', folder);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;