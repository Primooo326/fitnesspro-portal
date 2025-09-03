import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "El correo es requerido" }, { status: 400 });
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return NextResponse.json({ message: "Correo de recuperación enviado exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al enviar el correo de recuperación" }, { status: 500 });
  }
}
