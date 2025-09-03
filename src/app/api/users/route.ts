import { db, nombreProyecto } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const {
    nombre,
    edad,
    correo,
    telefono,
    notificaciones
  } = await request.json();

  if (!nombre || !edad || !correo || !telefono) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, `${nombreProyecto}/users`), {
      nombre,
      edad,
      correo,
      telefono,
      notificaciones,
      rol: 'residente',
    });
    return NextResponse.json({ message: "Usuario creado exitosamente", id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, `${nombreProyecto}/users`));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los usuarios" }, { status: 500 });
  }
}
