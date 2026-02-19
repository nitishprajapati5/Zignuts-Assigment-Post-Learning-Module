import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/_firebaseConfig/firebase-admin";
import { jsonWebTokenGeneration } from "@/app/utils/jsonWebTokenGeneration";


export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const snapshot = await adminDb
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "User Does Not Exits!" },
        { status: 401 },
      );
    }

    const userDoc = snapshot.docs[0];

    const userData = userDoc.data();

    const isPasswordValid = userData.password === password;

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid Credentials!" },
        { status: 401 },
      );
    }

    const result = {
      id:userDoc.id,
      ...userData
    }

    console.log(userData)

    const response = NextResponse.json({ data:result}, { status: 200 });

    response.cookies.set("auth_token", jsonWebTokenGeneration(userDoc.id), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 10,
      path: "/",
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error },
      { status: 500, statusText: "Something Went Wrong!" },
    );
  }
}
