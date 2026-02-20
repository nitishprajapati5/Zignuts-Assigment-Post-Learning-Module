import jwt from "jsonwebtoken"

export const jsonWebTokenGeneration = (id:string) => {
    return jwt.sign({id},process.env.JWT_TOKEN!,{expiresIn:'1d'})
}

export interface DecodeToken {
  id: string;
  iat: number;
  exp: number;
}