/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { adminDb } from "@/app/_firebaseConfig/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { FieldPath, FieldValue } from "firebase-admin/firestore";
import { DecodeToken } from "@/app/utils/jsonWebTokenGeneration";




export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_TOKEN!) as DecodeToken;
    const currentUserId = decoded.id;

    const userDoc = await adminDb.collection("users").doc(currentUserId).get();
    const userData = userDoc.data();
    const isAdmin = userData?.role === "admin";

    let tasksQuery;
    if (isAdmin) {
      tasksQuery = adminDb.collection("tasks");
    } else {
      tasksQuery = adminDb.collection("tasks").where("assignedTo", "==", currentUserId);
    }

    const tasksSnapshot = await tasksQuery.get();
    const assignedTasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (assignedTasks.length === 0) {
      return NextResponse.json({ tasksWithOwner: [] }, { status: 200 });
    }

    const userIds = Array.from(
      new Set(assignedTasks.map((task: any) => task.assignedTo).filter(Boolean))
    );

    let usersMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const batches = [];
      for (let i = 0; i < userIds.length; i += 10) {
        batches.push(userIds.slice(i, i + 10));
      }

      const snapshots = await Promise.all(
        batches.map((batch) =>
          adminDb.collection("users").where(FieldPath.documentId(), "in", batch).get()
        )
      );

      snapshots.forEach((snap) => {
        snap.docs.forEach((doc) => {
          usersMap[doc.id] = { id: doc.id, ...doc.data() };
        });
      });
    }

    const tasksWithAssignedUser = assignedTasks.map((task: any) => ({
      ...task,
      assignedUserDetails: usersMap[task.assignedTo] || { email: "Unassigned" },
    }));

    return NextResponse.json(
      { tasksWithOwner: tasksWithAssignedUser },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("API_ERROR:", error);
    return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
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
