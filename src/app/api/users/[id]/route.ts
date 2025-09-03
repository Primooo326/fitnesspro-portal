import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el usuario" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await request.json();

  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, data);
    return NextResponse.json({ message: "Usuario actualizado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el usuario" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const docRef = doc(db, "users", id);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Usuario eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el usuario" }, { status: 500 });
  }
}
