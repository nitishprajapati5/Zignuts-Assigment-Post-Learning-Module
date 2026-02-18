/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/app/_firebaseConfig/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const taskDoc = await adminDb.collection("tasks").doc(id).get();

    if (!taskDoc.exists) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const taskData = taskDoc.data();
    const assignedToId = taskData?.assignedTo;

    let assignedUserDetails = null;

    if (assignedToId) {
      const userDoc = await adminDb.collection("users").doc(assignedToId).get();

      if (userDoc.exists) {
        assignedUserDetails = {
          id: userDoc.id,
          ...userDoc.data(),
        };
      }
    }

    return NextResponse.json(
      {
        id: taskDoc.id,
        ...taskData,
        assignedUserDetails, 
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_TASK_BY_ID_ERROR:", error);
    return NextResponse.json(
      { message: "Error fetching task" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authToken = request.cookies.get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, assignedTo } = body;

    const taskRef = adminDb.collection("tasks").doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    await taskRef.update({
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
      ...(assignedTo && { assignedTo }),
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await taskRef.get()

    const newUpdatedTask = {
      id:updatedDoc.id,
      ...updatedDoc.data()
    }

    return NextResponse.json(
      { message: "Task updated successfully", 
        task:newUpdatedTask
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("UPDATE_TASK_ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await adminDb.collection("tasks").doc(id).delete();
  return NextResponse.json({ message: "Deleted successfully" });
}
