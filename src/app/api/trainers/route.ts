import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { 
    cedula, 
    codigo, 
    nombre, 
    correo, 
    celular, 
    datosPersonales, 
    contactoEmergencia 
  } = await request.json();

  if (!cedula || !codigo || !nombre || !correo || !celular) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, "trainers"), {
      cedula,
      codigo,
      nombre,
      correo,
      celular,
      datosPersonales,
      contactoEmergencia,
      rol: 'entrenador',
    });
    return NextResponse.json({ message: "Entrenador creado exitosamente", id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el entrenador" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "trainers"));
    const trainers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(trainers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los entrenadores" }, { status: 500 });
  }
}
