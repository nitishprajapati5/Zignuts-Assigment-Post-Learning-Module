import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminDb } from '@/app/_firebaseConfig/firebase-admin';

interface DecodeToken {
  id: string;
  iat: number;
  exp: number;
}

export async function GET(request: NextRequest) {
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

    const snapshot = await adminDb.collection('users').where("role","==","user").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
