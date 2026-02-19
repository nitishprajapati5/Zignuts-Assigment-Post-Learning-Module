import { adminDb } from "@/app/_firebaseConfig/firebase-admin";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

   const titleQuery = adminDb
      .collection("tasks")
      .orderBy("title")
      .startAt(text)
      .endAt(text + "\uf8ff");

    const descQuery = adminDb
      .collection("tasks")
      .orderBy("description")
      .startAt(text)
      .endAt(text + "\uf8ff");

    const [titleDocs, descDocs] = await Promise.all([titleQuery.get(), descQuery.get()]);

    const allDocs = [...titleDocs.docs,...descDocs.docs]

    const uniqueTasksMap = new Map();

    allDocs.forEach((doc) => {
        uniqueTasksMap.set(doc.id,{id:doc.id,...doc.data()});
    })

    const newData = Array.from(uniqueTasksMap.values())

    return NextResponse.json({ data: newData }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search tasks" },
      { status: 500 }
    );
  }
}
