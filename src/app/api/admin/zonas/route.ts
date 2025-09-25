import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { nombre, conjuntoId, aforo, descripcion, urlImagen } = await request.json();

  if (!nombre || !conjuntoId || aforo === undefined || !descripcion) {
    return NextResponse.json({ error: "Faltan campos requeridos: nombre, conjuntoId, aforo, descripcion" }, { status: 400 });
  }

  try {
    const newZoneData = {
      nombre,
      aforo,
      descripcion,
      ...(urlImagen && { urlImagen }), // Añadir solo si existe
      // horarios se inicializa vacío por defecto
      horarios: [],
    };

    const docRef = await addDoc(collection(db, `conjuntos/${conjuntoId}/zonas`), newZoneData);

    // Devolver el objeto completo para que el frontend pueda actualizar el estado
    return NextResponse.json({ ...newZoneData, id: docRef.id }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Un error desconocido ocurrió";
    return NextResponse.json({ error: "Error al crear la zona", details: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conjuntoId = searchParams.get('conjuntoId');

  if (!conjuntoId) {
    return NextResponse.json({ error: "conjuntoId es requerido" }, { status: 400 });
  }

  try {
    const q = query(collection(db, `conjuntos/${conjuntoId}/zonas`));
    const querySnapshot = await getDocs(q);
    const zonas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(zonas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener las zonas" }, { status: 500 });
  }
}
