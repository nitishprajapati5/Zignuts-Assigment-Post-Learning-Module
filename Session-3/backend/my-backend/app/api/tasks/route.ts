/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { adminDb } from "@/app/_firebaseConfig/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { FieldPath, FieldValue } from "firebase-admin/firestore";

interface DecodeToken {
  id: string;
  iat: number;
  exp: number;
}


export async function GET(request: NextRequest) {
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

    const tasksSnapshot = await adminDb
      .collection("tasks")
      .where("assignedTo", "==", currentUserId)
      .get();

    const assignedTasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    if (assignedTasks.length === 0) {
      return NextResponse.json({ tasksWithOwner: [] }, { status: 200 });
    }

   
    const userIds = Array.from(
      new Set(assignedTasks.map((task) => task.assignedTo).filter(Boolean))
    );

    let usersMap: Record<string, any> = {};
    
    if (userIds.length > 0) {
      const batches = [];
      for (let i = 0; i < userIds.length; i += 10) {
        batches.push(userIds.slice(i, i + 10));
      }

      const snapshots = await Promise.all(
        batches.map((batch) =>
          adminDb
            .collection("users")
            .where(FieldPath.documentId(), "in", batch)
            .get()
        )
      );

      snapshots.forEach((snap) => {
        snap.docs.forEach((doc) => {
          usersMap[doc.id] = doc.data();
        });
      });
    }

    const tasksWithAssignedUser = assignedTasks.map((task) => ({
      ...task,
      assignedUserDetails: usersMap[task.assignedTo] || null,
    }));

    return NextResponse.json(
      { tasksWithOwner: tasksWithAssignedUser },
      { 
        status: 200, 
        statusText: "Retrieved Successfully" 
      }
    );

  } catch (error) {
    console.error("API_ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { title, description, status, dueDate, assignedTo } = await request.json();

    const authToken = request.cookies.get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let ownerId: string;
    try {
      const decoded = jwt.verify(authToken, process.env.JWT_TOKEN!) as DecodeToken;
      ownerId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const docRef = await adminDb.collection("tasks").add({
      title,
      description,
      status,
      dueDate: dueDate,
      ownerId, 
      assignedTo: assignedTo || ownerId,
      createdAt: FieldValue.serverTimestamp(),
    });

    const docSnap = await docRef.get();
    
    const newTask = {
      id: docSnap.id,
      ...docSnap.data()
    };

    return NextResponse.json(
      {
        task: newTask,
        message: "Task created Successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
export async function PUT() {}
export async function DELETE() {}
