import { NextRequest,NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { adminDb } from "@/app/_firebaseConfig/firebase-admin";
import { DecodeToken } from "@/app/utils/jsonWebTokenGeneration";


export async function GET(request:NextRequest){
    try {
         const authToken = request.cookies.get('auth_token')?.value;
            if (!authToken) {
              return NextResponse.json(
                { message: 'Unauthorized: Missing auth token' },
                { status: 401 },
              );
            }
        
            let currentUserId: string;
            try {
              const decoded = jwt.verify(
                authToken,
                process.env.JWT_TOKEN!,
              ) as DecodeToken;
              currentUserId = decoded.id;
            } catch (err) {
              console.error('JWT Verification Error:', err);
              return NextResponse.json(
                { message: 'Unauthorized: Invalid auth token' },
                { status: 401 },
              );
            }

        const getAllUsers = (await adminDb.collection("users").get()).docs.length;
        const getAllTask = (await adminDb.collection("tasks").get()).docs
        const docsMapping = getAllTask.map((doc) => ({
            ...doc.data()
        }))

        const totalTask = docsMapping.length;
        const pendingTask = docsMapping.filter((task) => task.status === "pending" || task.status === "todo").length;
        const completedTask = docsMapping.filter((task) => task.status === "completed").length;
        const inprogress = docsMapping.filter((task) => task.status === "in-progress").length

        console.log(docsMapping)

        const result = [
            {title:"Totals Users",value:getAllUsers},
            {title:"Pending Tasks",value:pendingTask},
            {title:"Inprogress Task",value:inprogress},
            {title:"Completed Task",value:completedTask}
        ]


        return NextResponse.json({
            result
        })
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Something went Wrong!"},{status:403})
    }
}