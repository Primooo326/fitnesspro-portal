import { db, nombreProyecto } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// TODO: Replace with actual authenticated user's conjuntoId
const conjuntoId = "HARDCODED_CONJUNTO_ID";

export async function GET(request: Request, { params }: { params: { zonaId: string } }) {
  const { zonaId } = params;
  try {
    const docRef = doc(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas", zonaId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Zona no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener la zona" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { zonaId: string } }) {
  const { zonaId } = params;
  const data = await request.json();

  try {
    const docRef = doc(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas", zonaId);
    await updateDoc(docRef, data);
    return NextResponse.json({ message: "Zona actualizada exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar la zona" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { zonaId: string } }) {
  const { zonaId } = params;

  try {
    const docRef = doc(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas", zonaId);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Zona eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la zona" }, { status: 500 });
  }
}
