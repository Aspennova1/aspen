import { AppJwtPayload } from "@/utils/types";
import jwt, {JwtPayload} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // 7 days token
  });
}

export const verifyToken = async (
  token: string
): Promise<AppJwtPayload> => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as JwtPayload & AppJwtPayload;

  return decoded;
};

// export function verifyToken(token: string) {
//   try{
//     return jwt.verify(token, JWT_SECRET);
//   }
//   catch(ex){
//     console.log(ex);
    
//   }
// }
