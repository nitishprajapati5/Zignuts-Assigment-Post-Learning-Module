import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/_firebaseConfig/firebase-admin";
import { jsonWebTokenGeneration } from "@/app/utils/jsonWebTokenGeneration";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    const snapshot = await adminDb
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return NextResponse.json(
        { message: "Email Already Exists!" },
        { status: 409, statusText: "Email Already Exits" },
      );
    }

    const docRef = await adminDb.collection("users").add({
      email,
      password,
      role: role,
      createdAt: new Date(),
    });

    const response = NextResponse.json({ id: docRef.id }, { status: 200 });

    response.cookies.set("auth_token", jsonWebTokenGeneration(docRef.id), {
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
