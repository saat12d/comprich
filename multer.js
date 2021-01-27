// MULTER AND CLOUNINARY CONFIG
const multer = require('multer');

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only jpg, jpeg, png and gif image files are allowed'), false);
    }
    cb(null, true);
};

module.exports = multer({ storage: storage, fileFilter: imageFilter})