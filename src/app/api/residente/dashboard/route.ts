import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin'; // Asumimos que este archivo exporta la app de admin inicializada

// Helper para verificar el token de autenticación
async function verifyAuth(request: Request): Promise<string | null> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await getAuth(adminApp).verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error("Error al verificar el token:", error);
        return null;
    }
}

export async function GET(request: Request) {
    try {
        // 1. Verificar autenticación
        const userId = await verifyAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // 2. Obtener datos del residente y su conjuntoId
        const userRef = doc(db, 'usuarios', userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            return NextResponse.json({ error: "Perfil de usuario no encontrado" }, { status: 404 });
        }
        const residenteData = userSnap.data();
        const { conjuntoId } = residenteData;

        if (!conjuntoId) {
            return NextResponse.json({ error: "El usuario no está asociado a ningún conjunto" }, { status: 404 });
        }

        // 3. Obtener datos del conjunto
        const conjuntoRef = doc(db, 'conjuntos', conjuntoId);
        const conjuntoSnap = await getDoc(conjuntoRef);
        if (!conjuntoSnap.exists()) {
            return NextResponse.json({ error: "El conjunto residencial no fue encontrado" }, { status: 404 });
        }
        const conjuntoData = conjuntoSnap.data();

        // 4. Obtener zonas deportivas y sus horarios
        const zonasRef = collection(db, `conjuntos/${conjuntoId}/zonas`);
        const zonasSnap = await getDocs(zonasRef);

        const zonasConHorarios = await Promise.all(zonasSnap.docs.map(async (zonaDoc) => {
            const zonaData = zonaDoc.data();
            const horariosRef = collection(db, `conjuntos/${conjuntoId}/zonas/${zonaDoc.id}/horarios`);
            const horariosSnap = await getDocs(horariosRef);
            const horarios = horariosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return { id: zonaDoc.id, ...zonaData, horarios };
        }));

        // 5. Compilar y devolver la respuesta
        const dashboardData = {
            residente: residenteData,
            conjunto: { id: conjuntoSnap.id, ...conjuntoData },
            zonas: zonasConHorarios,
        };

        return NextResponse.json(dashboardData, { status: 200 });

    } catch (error: any) {
        console.error("Error al construir el dashboard del residente:", error);
        return NextResponse.json({ error: "Ocurrió un error en el servidor", details: error.message }, { status: 500 });
    }
}