import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const docRef = doc(db, "schedules", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Horario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el horario" }, { status: 500 });
  }
}
