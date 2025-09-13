import { PATH_USERS } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id: trainerId } = params;
  const { userId, rating, comment } = await request.json();

  if (!userId || !rating) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, PATH_USERS, trainerId, "ratings"), {
      userId,
      rating,
      comment,
    });
    return NextResponse.json({ message: "Calificación creada exitosamente", id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear la calificación" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: trainerId } = params;
  try {
    const querySnapshot = await getDocs(collection(db, PATH_USERS, trainerId, "ratings"));
    const ratings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(ratings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener las calificaciones" }, { status: 500 });
  }
}
