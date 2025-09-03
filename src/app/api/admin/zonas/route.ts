import { db, nombreProyecto } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// TODO: Replace with actual authenticated user's conjuntoId
const conjuntoId = "HARDCODED_CONJUNTO_ID";

export async function POST(request: Request) {
  const { nombre } = await request.json();

  if (!nombre) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas"), {
      nombre,
    });
    return NextResponse.json({ message: "Zona creada exitosamente", id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear la zona" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const querySnapshot = await getDocs(collection(db, `${nombreProyecto}/conjuntos`, conjuntoId, "zonas"));
    const zonas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(zonas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener las zonas" }, { status: 500 });
  }
}
