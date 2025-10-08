import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { PATH_CONJUNTOS, PATH_USERS } from '@/lib/constants';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { AdministradorConjunto, RolUsuario } from '@/models/interfaces';

export async function GET(request: Request) {
  try {
    const q = query(collection(db, PATH_CONJUNTOS), where("state", "==", true));
    const querySnapshot = await getDocs(q);
    const conjuntos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(conjuntos, { status: 200 });
  } catch (error) {
    console.error("Error fetching conjuntos:", error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-8);
};

export async function POST(request: Request) {
  try {
    const { nombre, direccion, adminUid, nombreAdmin, emailAdmin } = await request.json();

    if (!nombre) {
      return NextResponse.json({ error: 'Falta nombre del conjunto.' }, { status: 400 });
    }

    // Validaciones de unicidad (solo en conjuntos activos)
    const dupNameSnap = await getDocs(
      query(collection(db, PATH_CONJUNTOS), where('state', '==', true), where('nombre', '==', nombre))
    );
    if (!dupNameSnap.empty) {
      return NextResponse.json({ error: 'Ya existe un conjunto activo con el mismo nombre.' }, { status: 409 });
    }
    if (direccion) {
      const dupDirSnap = await getDocs(
        query(collection(db, PATH_CONJUNTOS), where('state', '==', true), where('direccion', '==', direccion))
      );
      if (!dupDirSnap.empty) {
        return NextResponse.json({ error: 'Ya existe un conjunto activo con la misma dirección.' }, { status: 409 });
      }
    }

    // Validar administrador antes de crear el conjunto
    if (adminUid) {
      const adminRef = doc(db, PATH_USERS, adminUid);
      const adminSnap = await getDoc(adminRef);
      if (!adminSnap.exists()) {
        return NextResponse.json({ error: 'Administrador no encontrado por UID.' }, { status: 404 });
      }
      const adminData: any = adminSnap.data();
      if (adminData?.conjuntoId && adminData.conjuntoId !== '') {
        return NextResponse.json({ error: 'El administrador ya está asignado a otro conjunto.' }, { status: 409 });
      }
    } else if (nombreAdmin && emailAdmin) {
      // Prevalidar que el email no exista en Auth
      const methods = await fetchSignInMethodsForEmail(auth, emailAdmin);
      if (methods && methods.length > 0) {
        return NextResponse.json({ error: 'El correo del administrador ya existe.' }, { status: 409 });
      }
    }

    // Flujo de creación con control de consistencia
    // Caso 1: asignar admin existente por UID (validado arriba)
    if (adminUid) {
      const adminRef = doc(db, PATH_USERS, adminUid);
      const adminSnap = await getDoc(adminRef);
      if (!adminSnap.exists()) {
        return NextResponse.json({ error: 'Administrador no encontrado por UID.' }, { status: 404 });
      }
      const adminData: any = adminSnap.data();
      if (adminData?.conjuntoId && adminData.conjuntoId !== '') {
        return NextResponse.json({ error: 'El administrador ya está asignado a otro conjunto.' }, { status: 409 });
      }

      // Crear conjunto y si falla actualizar admin, hacer rollback
      const conjuntoData: any = {
        nombre: nombre,
        direccion: direccion || '',
        administradorId: '',
        state: true,
      };
      const conjuntoDocRef = await addDoc(collection(db, PATH_CONJUNTOS), conjuntoData);
      try {
        await setDoc(adminRef, { conjuntoId: conjuntoDocRef.id, rol: RolUsuario.ADMINISTRADOR }, { merge: true });
        await updateDoc(doc(db, PATH_CONJUNTOS, conjuntoDocRef.id), { administradorId: adminUid });
      } catch (e) {
        // rollback conjunto creado
        await deleteDoc(doc(db, PATH_CONJUNTOS, conjuntoDocRef.id));
        return NextResponse.json({ error: 'No se pudo asignar el administrador al conjunto.' }, { status: 500 });
      }
      return NextResponse.json(
        { message: 'Conjunto creado exitosamente', conjuntoId: conjuntoDocRef.id },
        { status: 201 }
      );
    }

    // Caso 2: crear nuevo admin (crear primero en Auth, luego crear conjunto, luego persistir user/conjunto)
    if (nombreAdmin && emailAdmin) {
      const temporaryPassword = generateTemporaryPassword();
      let adminCredential;
      try {
        adminCredential = await createUserWithEmailAndPassword(auth, emailAdmin, temporaryPassword);
        console.log(`Contraseña temporal para ${emailAdmin}: ${temporaryPassword}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          return NextResponse.json({ error: 'El correo del administrador ya está registrado.' }, { status: 409 });
        }
        console.error('Error creando usuario en Firebase Auth:', error);
        return NextResponse.json({ error: 'Error al crear el usuario de autenticación.' }, { status: 500 });
      }

      const newAdminUid = adminCredential.user.uid;
      const conjuntoData: any = {
        nombre: nombre,
        direccion: direccion || '',
        administradorId: newAdminUid,
        state: true,
      };
      const conjuntoDocRef = await addDoc(collection(db, PATH_CONJUNTOS), conjuntoData);
      try {
        const adminData: AdministradorConjunto = {
          nombre: nombreAdmin,
          email: emailAdmin,
          telefono: '',
          rol: RolUsuario.ADMINISTRADOR,
          fechaCreacion: new Date(),
          id: newAdminUid,
          conjuntoId: conjuntoDocRef.id,
        };
        await setDoc(doc(db, PATH_USERS, newAdminUid), adminData, { merge: true });
      } catch (e) {
        // rollback conjunto si falla persistir el admin en Firestore
        await deleteDoc(doc(db, PATH_CONJUNTOS, conjuntoDocRef.id));
        // TODO: considerar borrar el usuario de Auth creado si falla persistencia en Firestore
        return NextResponse.json({ error: 'No se pudo guardar el administrador del conjunto.' }, { status: 500 });
      }
      return NextResponse.json(
        { message: 'Conjunto y administrador creados exitosamente', conjuntoId: conjuntoDocRef.id },
        { status: 201 }
      );
    }

    // Caso 3: sin admin (ningún adminUid y sin nombre/email admin)
    const conjuntoData: any = {
      nombre: nombre,
      direccion: direccion || '',
      administradorId: '',
      state: true,
    };
    const conjuntoDocRef = await addDoc(collection(db, PATH_CONJUNTOS), conjuntoData);
    return NextResponse.json(
      { message: 'Conjunto creado exitosamente', conjuntoId: conjuntoDocRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en el proceso de creación del conjunto:", error);
    // TODO: Implementar lógica de rollback (ej. si falla Firestore, borrar el usuario de Auth)
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}

// Soft-delete de conjunto y limpieza del conjuntoId en el administrador
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Falta parámetro id' }, { status: 400 });
    }

    const conjuntoRef = doc(db, PATH_CONJUNTOS, id);
    const conjuntoSnap = await getDoc(conjuntoRef);
    if (!conjuntoSnap.exists()) {
      return NextResponse.json({ error: 'Conjunto no encontrado' }, { status: 404 });
    }

    const data = conjuntoSnap.data() as any;
    const adminUid = data?.administradorId as string | undefined;

    // Limpiar referencia de conjunto en el admin, si existe
    if (adminUid) {
      const adminRef = doc(db, PATH_USERS, adminUid);
      await setDoc(adminRef, { conjuntoId: '' }, { merge: true });
    }

    // Soft-delete del conjunto
    await updateDoc(conjuntoRef, { state: false });

    return NextResponse.json({ message: 'Conjunto eliminado y admin actualizado' }, { status: 200 });
  } catch (error) {
    console.error('Error eliminando conjunto:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

// Edición de conjunto: asignar/crear/eliminar administrador y actualizar datos básicos
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Falta parámetro id' }, { status: 400 });
    }

    const body = await request.json();
    const { nombre, direccion, assignAdminUid, createAdmin, removeAdmin } = body || {};

    const conjuntoRef = doc(db, PATH_CONJUNTOS, id);
    const conjuntoSnap = await getDoc(conjuntoRef);
    if (!conjuntoSnap.exists()) {
      return NextResponse.json({ error: 'Conjunto no encontrado' }, { status: 404 });
    }

    // Actualización de datos básicos si vienen
    const updates: any = {};
    // Validaciones de unicidad al actualizar
    if (typeof nombre === 'string' && nombre.trim().length > 0) {
      const dupByName = await getDocs(
        query(collection(db, PATH_CONJUNTOS), where('state', '==', true), where('nombre', '==', nombre))
      );
      const conflict = dupByName.docs.find(d => d.id !== id);
      if (conflict) {
        return NextResponse.json({ error: 'Ya existe un conjunto activo con el mismo nombre.' }, { status: 409 });
      }
      updates.nombre = nombre;
    }
    if (typeof direccion === 'string') {
      const dirVal = direccion || '';
      const dupByDir = await getDocs(
        query(collection(db, PATH_CONJUNTOS), where('state', '==', true), where('direccion', '==', dirVal))
      );
      const conflictDir = dupByDir.docs.find(d => d.id !== id);
      if (conflictDir) {
        return NextResponse.json({ error: 'Ya existe un conjunto activo con la misma dirección.' }, { status: 409 });
      }
      updates.direccion = dirVal;
    }

    // Remover administrador
    if (removeAdmin === true) {
      const currentAdminUid = (conjuntoSnap.data() as any)?.administradorId;
      if (currentAdminUid) {
        await setDoc(doc(db, PATH_USERS, currentAdminUid), { conjuntoId: '' }, { merge: true });
      }
      updates.administradorId = '';
    }

    // Asignar administrador existente (validar disponibilidad)
    if (assignAdminUid) {
      const aRef = doc(db, PATH_USERS, assignAdminUid);
      const aSnap = await getDoc(aRef);
      if (!aSnap.exists()) {
        return NextResponse.json({ error: 'Administrador no encontrado por UID.' }, { status: 404 });
      }
      const aData: any = aSnap.data();
      if (aData?.conjuntoId && aData.conjuntoId !== '') {
        return NextResponse.json({ error: 'El administrador ya está asignado a otro conjunto.' }, { status: 409 });
      }
      await setDoc(aRef, { conjuntoId: id, rol: RolUsuario.ADMINISTRADOR }, { merge: true });
      updates.administradorId = assignAdminUid;
    }

    // Crear nuevo administrador (prevalidar email)
    if (createAdmin && createAdmin.nombreAdmin && createAdmin.emailAdmin) {
      const methods = await fetchSignInMethodsForEmail(auth, createAdmin.emailAdmin);
      if (methods && methods.length > 0) {
        return NextResponse.json({ error: 'El correo del administrador ya existe.' }, { status: 409 });
      }
      const temporaryPassword = generateTemporaryPassword();
      let adminCredential;
      try {
        adminCredential = await createUserWithEmailAndPassword(auth, createAdmin.emailAdmin, temporaryPassword);
        console.log(`Contraseña temporal para ${createAdmin.emailAdmin}: ${temporaryPassword}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          return NextResponse.json({ error: 'El correo del administrador ya está registrado.' }, { status: 409 });
        }
        console.error('Error creando usuario en Firebase Auth:', error);
        return NextResponse.json({ error: 'Error al crear el usuario de autenticación.' }, { status: 500 });
      }

      const newAdminUid = adminCredential.user.uid;
      await setDoc(
        doc(db, PATH_USERS, newAdminUid),
        {
          id: newAdminUid,
          nombre: createAdmin.nombreAdmin,
          email: createAdmin.emailAdmin,
          telefono: '',
          rol: RolUsuario.ADMINISTRADOR,
          fechaCreacion: new Date(),
          conjuntoId: id,
        } as AdministradorConjunto,
        { merge: true }
      );
      updates.administradorId = newAdminUid;
    }

    // Persistir cambios del conjunto si hay
    if (Object.keys(updates).length > 0) {
      await updateDoc(conjuntoRef, updates);
    }

    return NextResponse.json({ message: 'Conjunto actualizado' }, { status: 200 });
  } catch (error) {
    console.error('Error actualizando conjunto:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}