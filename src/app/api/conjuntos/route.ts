import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { PATH_CONJUNTOS, PATH_USERS } from '@/lib/constants';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
    const { nombre, direccion, nombreAdmin, emailAdmin } = await request.json();

    if (!nombre || !nombreAdmin || !emailAdmin) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }


    const conjuntoData = {
      nombre: nombre,
      direccion: direccion || '',
      administradorId: '',
      state: true,
    };
    const temporaryPassword = generateTemporaryPassword();
    let adminCredential
    try {
      adminCredential = await createUserWithEmailAndPassword(auth, emailAdmin, temporaryPassword);
      console.log(`Contraseña temporal para ${emailAdmin}: ${temporaryPassword}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return NextResponse.json({ error: 'El correo del administrador ya está registrado.' }, { status: 409 });
      }
      console.error("Error creating user in Firebase Auth:", error);
      return NextResponse.json({ error: 'Error al crear el usuario de autenticación.' }, { status: 500 });
    }

    const adminUid = adminCredential.user.uid;
    conjuntoData.administradorId = adminUid;

    const conjuntoDocRef = await addDoc(collection(db, PATH_CONJUNTOS), conjuntoData);


    const adminData: AdministradorConjunto = {
      nombre: nombreAdmin,
      email: emailAdmin,
      telefono: '',
      rol: RolUsuario.ADMINISTRADOR,
      fechaCreacion: new Date(),
      id: adminUid,
      conjuntoId: conjuntoDocRef.id,
    }


    await addDoc(collection(db, PATH_USERS), adminData);

    return NextResponse.json(
      {
        message: 'Conjunto y administrador creados exitosamente',
        conjuntoId: conjuntoDocRef.id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en el proceso de creación del conjunto:", error);
    // TODO: Implementar lógica de rollback (ej. si falla Firestore, borrar el usuario de Auth)
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}
