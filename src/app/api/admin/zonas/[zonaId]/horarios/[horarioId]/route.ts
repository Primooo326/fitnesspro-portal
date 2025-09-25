import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { zonaId: string, horarioId: string } }) {
  const { zonaId, horarioId } = params;
  const { searchParams } = new URL(request.url);
  const conjuntoId = searchParams.get('conjuntoId');

  if (!conjuntoId) {
    return NextResponse.json({ error: "El ID del conjunto es requerido" }, { status: 400 });
  }

  try {
    const docRef = doc(db, `conjuntos/${conjuntoId}/zonas/${zonaId}/horarios`, horarioId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Horario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el horario" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { zonaId: string, horarioId: string } }) {
  const { zonaId, horarioId } = params;
  const { conjuntoId, ...dataToUpdate } = await request.json();

  if (!conjuntoId) {
    return NextResponse.json({ error: "El ID del conjunto es requerido" }, { status: 400 });
  }

  try {
    const docRef = doc(db, `conjuntos/${conjuntoId}/zonas/${zonaId}/horarios`, horarioId);
    await updateDoc(docRef, dataToUpdate);
    return NextResponse.json({ message: "Horario actualizado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el horario" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { zonaId: string, horarioId: string } }) {
  const { zonaId, horarioId } = params;
  const { conjuntoId } = await request.json();

  if (!conjuntoId) {
    return NextResponse.json({ error: "El ID del conjunto es requerido" }, { status: 400 });
  }

  try {
    const docRef = doc(db, `conjuntos/${conjuntoId}/zonas/${zonaId}/horarios`, horarioId);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Horario eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el horario" }, { status: 500 });
  }
}
