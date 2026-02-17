import jwt from "jsonwebtoken"

export const jsonWebTokenGeneration = (id:string) => {
    return jwt.sign({id},process.env.JWT_TOKEN!,{expiresIn:'1d'})
}