import { db, nombreProyecto } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// TODO: Replace with actual authenticated user's conjuntoId
const conjuntoId = "HARDCODED_CONJUNTO_ID";

export async function GET(request: Request, { params }: { params: { zonaId: string, horarioId: string } }) {
  const { zonaId, horarioId } = params;
  try {
    const docRef = doc(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas", zonaId, "horarios", horarioId);
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
  const data = await request.json();

  try {
    const docRef = doc(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas", zonaId, "horarios", horarioId);
    await updateDoc(docRef, data);
    return NextResponse.json({ message: "Horario actualizado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el horario" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { zonaId: string, horarioId: string } }) {
  const { zonaId, horarioId } = params;

  try {
    const docRef = doc(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas", zonaId, "horarios", horarioId);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Horario eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el horario" }, { status: 500 });
  }
}
