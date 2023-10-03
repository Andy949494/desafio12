import {fileURLToPath} from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,`${__dirname}/public/images`)
//     },
//     filename:function(req,file,cb){
//         cb(null,`${Date.now()}-${file.originalname}`)
//     }
// })

// export const uploader = multer({storage,onError:function(err,next){
//     console.log(err);
//     next();
// }});

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        let field = file.fieldname;
        if(field == 'thumbnails'){
            cb(null,`${__dirname}/public/images/products`)
        } else if(field == 'documents'){
            cb(null,`${__dirname}/public/documents`)
        } else if(field == 'profile'){
            cb(null,`${__dirname}/public/profiles/profiles`)
        } else {
            cb(null,`${__dirname}/public/invalid`)
        }
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
});

export const uploader = multer({storage});

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

export default __dirname;