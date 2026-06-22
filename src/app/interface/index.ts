
export type TImageFiles = { [fieldname: string]: Express.Multer.File[] };


declare global {
  namespace Express {
    interface Request {
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
      user?: any
    }
  }
}
