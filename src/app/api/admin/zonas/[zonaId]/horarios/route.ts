import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { zonaId: string } }) {
  const { zonaId } = params;
  const { conjuntoId, dia, horaInicio, horaFin, aforo } = await request.json();

  if (!conjuntoId || !dia || !horaInicio || !horaFin || aforo === undefined) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, `conjuntos/${conjuntoId}/zonas/${zonaId}/horarios`), {
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
  const { searchParams } = new URL(request.url);
  const conjuntoId = searchParams.get('conjuntoId');

  if (!conjuntoId) {
    return NextResponse.json({ error: "El ID del conjunto es requerido" }, { status: 400 });
  }

  try {
    const querySnapshot = await getDocs(collection(db, `conjuntos/${conjuntoId}/zonas/${zonaId}/horarios`));
    const horarios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(horarios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los horarios" }, { status: 500 });
  }
}
