import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { DecodeToken } from "@/app/utils/jsonWebTokenGeneration";



export async function POST(request:NextRequest){
    try {
        const authToken = request.cookies.get("auth_token")?.value;
            if (!authToken) {
              return NextResponse.json(
                { message: "Unauthorized: Missing auth token" },
                { status: 401 }
              );
            }
        
            let currentUserId: string;
            try {
              const decoded = jwt.verify(
                authToken,
                process.env.JWT_TOKEN!
              ) as DecodeToken;
              currentUserId = decoded.id;
            } catch (err) {
              console.error("JWT Verification Error:", err);
              return NextResponse.json(
                { message: "Unauthorized: Invalid auth token" },
                { status: 401 }
              );
            }

            return NextResponse.json({currentUserId},{status:200})

    } catch (error) {
        return NextResponse.json({},{status:403})
    }
}