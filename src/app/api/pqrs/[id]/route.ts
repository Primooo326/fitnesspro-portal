import {
  db, nombreProyecto

} from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const docRef = doc(db, `${nombreProyecto}/pqrs`, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "PQR no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el PQR" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await request.json();

  try {
    const docRef = doc(db, `${nombreProyecto}/pqrs`, id);
    await updateDoc(docRef, data);
    return NextResponse.json({ message: "PQR actualizado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el PQR" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const docRef = doc(db, `${nombreProyecto}/pqrs`, id);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "PQR eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el PQR" }, { status: 500 });
  }
}
