import express from "express";
import multer from "multer";
import path from "path";


const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/')
    },
    
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file,cb){
    const filetypes = /jpg|jpeg|png/;
    const extName =filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extName) {
        return cb(null, true);
    } else {
        cb("please submit image in jpeg, png or jpg format");
    }
}

const upload = multer({
    storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
})

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: "Image upload successfully",
        imagePath: `/${req.file.path}`
    })
})
export default router;
