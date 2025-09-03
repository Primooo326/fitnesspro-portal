import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET: Obtener un conjunto específico por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const docRef = doc(db, 'conjuntos', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Conjunto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });

  } catch (error) {
    console.error("Error fetching conjunto:", error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

// PUT: Actualizar un conjunto específico
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { nombreConjunto, direccion } = await request.json();

    if (!nombreConjunto || !direccion) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const docRef = doc(db, 'conjuntos', id);
    await updateDoc(docRef, {
      nombre: nombreConjunto,
      direccion: direccion,
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
    
    // TODO: Implementar una lógica más robusta con Firebase Admin SDK.
    // Esta implementación simplificada no elimina el usuario de Firebase Auth,
    // solo los documentos de Firestore.

    const conjuntoRef = doc(db, 'conjuntos', id);
    const conjuntoSnap = await getDoc(conjuntoRef);

    if (!conjuntoSnap.exists()) {
      return NextResponse.json({ error: 'Conjunto no encontrado' }, { status: 404 });
    }

    const adminUid = conjuntoSnap.data().administradorId;

    // Eliminar el documento del conjunto
    await deleteDoc(conjuntoRef);

    // Eliminar el documento del usuario admin asociado (si existe)
    if (adminUid) {
      await deleteDoc(doc(db, 'users', adminUid));
    }

    return NextResponse.json({ message: 'Conjunto y administrador asociado eliminados de Firestore' }, { status: 200 });

  } catch (error) {
    console.error("Error deleting conjunto:", error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
