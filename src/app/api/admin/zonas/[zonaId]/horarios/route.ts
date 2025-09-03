import { db, nombreProyecto } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// TODO: Replace with actual authenticated user's conjuntoId
const conjuntoId = "HARDCODED_CONJUNTO_ID";

export async function POST(request: Request, { params }: { params: { zonaId: string } }) {
  const { zonaId } = params;
  const { dia, horaInicio, horaFin, aforo } = await request.json();

  if (!dia || !horaInicio || !horaFin || !aforo) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas", zonaId, "horarios"), {
      dia,
      horaInicio,
      horaFin,
      aforo,
    });
    return NextResponse.json({ message: "Horario creado exitosamente", id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el horario" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { zonaId: string } }) {
  const { zonaId } = params;
  try {
    const querySnapshot = await getDocs(collection(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas", zonaId, "horarios"));
    const horarios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(horarios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los horarios" }, { status: 500 });
  }
}
