import { db, nombreProyecto } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, trainerId, dateTime, type } = await request.json();

  if (!userId || !trainerId || !dateTime || !type) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, `${nombreProyecto}/requests`), {
      userId,
      trainerId,
      dateTime,
      type,
      status: 'pending',
    });
    return NextResponse.json({ message: "Solicitud de entrenamiento creada exitosamente", id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear la solicitud de entrenamiento" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, `${nombreProyecto}/requests`));
    const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener las solicitudes de entrenamiento" }, { status: 500 });
  }
}
