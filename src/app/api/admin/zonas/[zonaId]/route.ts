import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { zonaId: string } }) {
  const { zonaId } = params;
  const { searchParams } = new URL(request.url);
  const conjuntoId = searchParams.get('conjuntoId');

  if (!conjuntoId) {
    return NextResponse.json({ error: "El ID del conjunto es requerido" }, { status: 400 });
  }

  try {
    const docRef = doc(db, `conjuntos/${conjuntoId}/zonas`, zonaId);
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
  const { conjuntoId, ...dataToUpdate } = await request.json();

  if (!conjuntoId) {
    return NextResponse.json({ error: "El ID del conjunto es requerido" }, { status: 400 });
  }

  try {
    const docRef = doc(db, `conjuntos/${conjuntoId}/zonas`, zonaId);
    await updateDoc(docRef, dataToUpdate);
    return NextResponse.json({ message: "Zona actualizada exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar la zona" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { zonaId: string } }) {
  const { zonaId } = params;
  const { conjuntoId } = await request.json(); // Se espera el conjuntoId en el body

  if (!conjuntoId) {
    return NextResponse.json({ error: "El ID del conjunto es requerido" }, { status: 400 });
  }

  try {
    // Aquí se asume que la estructura es `conjuntos/{conjuntoId}/zonas/{zonaId}`
    const docRef = doc(db, `conjuntos/${conjuntoId}/zonas`, zonaId);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Zona eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Un error desconocido ocurrió";
    return NextResponse.json({ error: "Error al eliminar la zona", details: errorMessage }, { status: 500 });
  }
}
