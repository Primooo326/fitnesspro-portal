import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { NextResponse } from 'next/server';
import { RolUsuario, Residente } from '@/models/interfaces';

export async function POST(request: Request) {
    try {
        const { email, password, nombre, edad, telefono, conjuntoId } = await request.json();

        // 1. Validar campos de entrada
        if (!email || !password || !nombre || !edad || !telefono || !conjuntoId) {
            return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
        }

        // 2. Verificar que el conjunto residencial existe
        const conjuntoRef = doc(db, 'conjuntos', conjuntoId);
        const conjuntoSnap = await getDoc(conjuntoRef);
        if (!conjuntoSnap.exists()) {
            return NextResponse.json({ error: "El conjunto residencial no existe" }, { status: 404 });
        }

        // 3. Crear usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 4. Crear el documento del residente en Firestore
        const residenteData: Omit<Residente, 'id'> = {
            nombre,
            email: user.email!, // Usar el email verificado del objeto user
            rol: RolUsuario.RESIDENTE,
            edad,
            telefono,
            conjuntoId,
            aceptaNotificaciones: true, // Valor por defecto
            fechaCreacion: new Date(),
        };

        // Usar el UID de la autenticación como ID del documento en Firestore
        const userDocRef = doc(db, 'usuarios', user.uid);
        await setDoc(userDocRef, { ...residenteData, id: user.uid });

        // Anidar también una referencia o los datos del usuario dentro del conjunto puede ser útil para listados, pero la fuente de verdad estará en /usuarios
        const userInConjuntoRef = doc(db, `conjuntos/${conjuntoId}/usuarios`, user.uid);
        await setDoc(userInConjuntoRef, { nombre: residenteData.nombre, email: residenteData.email, rol: residenteData.rol });


        return NextResponse.json({ message: "Residente registrado exitosamente", userId: user.uid }, { status: 201 });

    } catch (error: any) {
        console.error("Error en el registro:", error);

        // Manejar errores específicos de Firebase Auth
        if (error.code === 'auth/email-already-in-use') {
            return NextResponse.json({ error: "El correo electrónico ya está en uso" }, { status: 409 });
        }
        if (error.code === 'auth/weak-password') {
            return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
        }

        return NextResponse.json({ error: "Ocurrió un error en el servidor", details: error.message }, { status: 500 });
    }
}