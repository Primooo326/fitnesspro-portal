import { db, nombreProyecto } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { nombre, conjuntoId, aforo } = await request.json();

  if (!nombre || !conjuntoId || aforo === undefined) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, `conjuntos/${conjuntoId}/zonas`), {
      nombre,
      aforo,
    });
    return NextResponse.json({ message: "Zona creada exitosamente", id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear la zona" }, { status: 500 });
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
