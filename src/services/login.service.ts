import { COLLECTIONS } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';

export const login = async (email: string, password: string) => {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Verificar que el correo esté verificado
    if (!user.emailVerified) {
        // Cerrar sesión inmediatamente para no dejar sesión inconsistente
        await signOut(auth);
        throw new Error('Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.');
    }
    const uid = user.uid;

    // Obtener datos del usuario desde Firestore usando el UID como ID del documento
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    const userDocSnap = await getDoc(userDocRef);


    if (userDocSnap.exists()) {
        const userData: any = userDocSnap.data();
        console.log(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    } else {
        console.warn('Usuario no encontrado en Firestore:', uid);
        return null;
    }
}

export const resendVerificationEmail = async (email: string, password: string) => {
    // Inicia sesión temporalmente para poder enviar el correo de verificación
    const cred = await signInWithEmailAndPassword(auth, email, password);
    try {
        if (cred.user.emailVerified) {
            // Si ya está verificado, no tiene sentido reenviar
            await signOut(auth);
            return { alreadyVerified: true };
        }
        await sendEmailVerification(cred.user);
        return { sent: true };
    } finally {
        // Cierra sesión para no dejar sesión abierta
        await signOut(auth);
    }
}

export const getLoggedUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        return JSON.parse(userData);
    } else {
        return null;
    }
}

export const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Error en logout:', error);
        // Forzar limpieza local incluso si falla signOut
        localStorage.removeItem('user');
    }
}

