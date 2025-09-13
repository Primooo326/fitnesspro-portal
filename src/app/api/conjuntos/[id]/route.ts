import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { PATH_CONJUNTOS, PATH_USERS } from '@/lib/constants';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const docRefConjunto = doc(db, PATH_CONJUNTOS, id);
    const docSnapConjunto = await getDoc(docRefConjunto);

    if (!docSnapConjunto.exists()) {
      return NextResponse.json({ error: 'Conjunto no encontrado' }, { status: 404 });
    }

    const docRefAdmin = doc(db, PATH_USERS, docSnapConjunto.data().administradorId);
    const docSnapAdmin = await getDoc(docRefAdmin);

    return NextResponse.json({ id: docSnapConjunto.id, ...docSnapConjunto.data(), administrador: docSnapAdmin.data() }, { status: 200 });

  } catch (error) {
    console.error("Error fetching conjunto:", error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

// PUT: Actualizar un conjunto específico
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { nombre, direccion } = await request.json();

    if (!nombre || !direccion) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const docRef = doc(db, PATH_CONJUNTOS, id);
    await updateDoc(docRef, {
      nombre,
      direccion
    });

    return NextResponse.json({ message: 'Conjunto actualizado exitosamente' }, { status: 200 });

  } catch (error) {
    console.error("Error updating conjunto:", error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

// DELETE: Eliminar un conjunto
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;


    const conjuntoRef = doc(db, PATH_CONJUNTOS, id);
    const conjuntoSnap = await getDoc(conjuntoRef);

    if (!conjuntoSnap.exists()) {
      return NextResponse.json({ error: 'Conjunto no encontrado' }, { status: 404 });
    }

    //actualizar el estado del conjunto
    await updateDoc(conjuntoRef, {
      state: false
    });

    return NextResponse.json({ message: 'Conjunto y administrador asociado eliminados de Firestore' }, { status: 200 });

  } catch (error) {
    console.error("Error deleting conjunto:", error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
