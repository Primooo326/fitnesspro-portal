import { PATH_USERS } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';



export const login = async (email: string, password: string) => {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDocRef = doc(db, PATH_USERS, uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        const userData: any = userDocSnap.data();
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    } else {
        console.warn('User document not found in Firestore for UID:', uid);
        return null;
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

export const logout = () => {
    localStorage.removeItem('user');
}

