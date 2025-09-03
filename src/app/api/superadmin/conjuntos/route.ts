import { NextResponse } from 'next/server';
import { db, auth, nombreProyecto } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// GET: Obtener todos los conjuntos
export async function GET(request: Request) {
  try {
    const querySnapshot = await getDocs(collection(db, `${nombreProyecto}/conjuntos`));
    const conjuntos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(conjuntos, { status: 200 });
  } catch (error) {
    console.error("Error fetching conjuntos:", error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

// (El código de la función POST que ya creamos sigue aquí...)
// Helper para generar una contraseña temporal segura
const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-8);
};

export async function POST(request: Request) {
  try {
    const { nombreConjunto, direccion, nombreAdmin, emailAdmin } = await request.json();

    // 1. Validación de datos de entrada
    if (!nombreConjunto || !nombreAdmin || !emailAdmin) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const temporaryPassword = generateTemporaryPassword();
    let adminCredential;

    // 2. Crear usuario en Firebase Authentication
    try {
      adminCredential = await createUserWithEmailAndPassword(auth, emailAdmin, temporaryPassword);
      // En una app real, aquí enviarías un email al admin con su contraseña temporal.
      console.log(`Contraseña temporal para ${emailAdmin}: ${temporaryPassword}`);
    } catch (error: any) {
      // Error común: el email ya está en uso
      if (error.code === 'auth/email-already-in-use') {
        return NextResponse.json({ error: 'El correo del administrador ya está registrado.' }, { status: 409 });
      }
      console.error("Error creating user in Firebase Auth:", error);
      return NextResponse.json({ error: 'Error al crear el usuario de autenticación.' }, { status: 500 });
    }

    const adminUid = adminCredential.user.uid;

    // 3. Crear el documento del conjunto en Firestore
    const conjuntoData = {
      nombre: nombreConjunto,
      direccion: direccion,
      administradorId: adminUid, // Enlazamos con el UID del admin
      fechaCreacion: new Date(),
    };
    const conjuntoDocRef = await addDoc(collection(db, `${nombreProyecto}/conjuntos`), conjuntoData);

    // 4. Crear el documento del usuario (rol admin) en Firestore
    const adminData = {
      nombre: nombreAdmin,
      email: emailAdmin,
      rol: 'admin', // Asignamos el rol de administrador de conjunto
      conjuntoId: conjuntoDocRef.id, // Enlazamos con el ID del nuevo conjunto
      fechaCreacion: new Date(),
    };
    await setDoc(doc(db, `${nombreProyecto}/users`, adminUid), adminData);

    return NextResponse.json(
      {
        message: 'Conjunto y administrador creados exitosamente',
        conjuntoId: conjuntoDocRef.id,
        adminUid: adminUid,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en el proceso de creación del conjunto:", error);
    // TODO: Implementar lógica de rollback (ej. si falla Firestore, borrar el usuario de Auth)
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}
