import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, type, description } = await request.json();

  if (!userId || !type || !description) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, "pqrs"), {
      userId,
      type,
      description,
      status: 'open',
    });
    return NextResponse.json({ message: "PQR creado exitosamente", id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el PQR" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "pqrs"));
    const pqrs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(pqrs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los PQRs" }, { status: 500 });
  }
}
