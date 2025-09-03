import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const docRef = doc(db, "requests", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener la solicitud" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await request.json();

  try {
    const docRef = doc(db, "requests", id);
    await updateDoc(docRef, data);
    return NextResponse.json({ message: "Solicitud actualizada exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar la solicitud" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const docRef = doc(db, "requests", id);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Solicitud eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la solicitud" }, { status: 500 });
  }
}
