import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "schedules"));
    const schedules = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los horarios" }, { status: 500 });
  }
}
