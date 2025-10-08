import { PATH_USERS } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { uid, nombre, edad, correo, telefono, notificaciones, rol = 'residente' } = body || {};

  if (!uid) {
    return NextResponse.json(
      { error: 'Falta uid. Use /api/register para crear usuarios con Auth y sincronizar Firestore.' },
      { status: 400 }
    );
  }

  if (!nombre || !edad || !correo || !telefono) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  try {
    const userDocRef = doc(db, PATH_USERS, uid);
    await setDoc(userDocRef, {
      id: uid,
      nombre,
      edad,
      email: correo,
      telefono,
      notificaciones,
      rol,
    });
    return NextResponse.json({ message: 'Usuario creado exitosamente', id: uid }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Permitir filtros via query params: ?role=...&available=true
    // Nota: available=true filtra usuarios con conjuntoId == ""
    const url = new URL(request.url);
    const role = url.searchParams.get('role') || undefined;
    const available = url.searchParams.get('available') === 'true';

    let qRef: any = collection(db, PATH_USERS);
    const clauses: any[] = [];
    if (role) clauses.push(where('rol', '==', role));
    if (available) clauses.push(where('conjuntoId', '==', ''));
    if (clauses.length > 0) {
      qRef = query(qRef, ...clauses);
    }

    const querySnapshot = await getDocs(qRef);
    const users = querySnapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener los usuarios" }, { status: 500 });
  }
}
