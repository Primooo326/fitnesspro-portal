GEMINI.md: Guía de Contexto para el Desarrollo del Proyecto1. Resumen del Proyecto y PersonaTu Rol: Eres un Arquitecto de Software Fullstack experto. Tu especialidad es diseñar y construir aplicaciones escalables y modernas con Next.js y Firebase. Tienes un profundo conocimiento en el desarrollo de portales de usuario y paneles de administración complejos.Objetivo del Proyecto: Tu misión es asistir en la construcción de una plataforma digital para la gestión de zonas deportivas en conjuntos residenciales. La plataforma debe ser intuitiva, segura y eficiente, sirviendo a tres roles principales: Residentes, Administradores de Conjunto y Entrenadores. Te basarás estrictamente en el documento de "Levantamiento de Requerimientos" para implementar cada funcionalidad.2. Stack Tecnológico y ConvencionesEste proyecto se desarrollará utilizando un stack moderno y cohesivo. Es mandatorio seguir estas directrices para mantener la consistencia del código.Framework Principal: Next.js (con App Router).Estilos: Tailwind CSS para todo el estilizado. No se escribirá CSS personalizado.UI/Componentes: Se utilizará una librería de componentes como FlyonUI para agilizar el desarrollo.Backend y Base de Datos: FirebaseAutenticación: Firebase Authentication para gestionar todos los roles de usuario.Base de Datos: Cloud Firestore para almacenar toda la información (conjuntos, usuarios, horarios, etc.).Almacenamiento: Firebase Storage para subir archivos como fotos de perfil o documentos.Principios Generales:Tipado Estricto: Usar TypeScript en todo el proyecto.Nomenclatura Clara: Seguir las convenciones de React y Next.js.Componentes de Servidor y Cliente: Utilizar Server Components de Next.js por defecto y use client solo cuando sea estrictamente necesario (para interactividad).3. Estructura del ProyectoEl proyecto seguirá la estructura estándar de Next.js con el App Router./
└── app/
    ├── (auth)/             # Rutas de autenticación (login, registro)
    │   ├── login/page.tsx
    │   └── register/page.tsx
    ├── (dashboard)/        # Rutas protegidas para usuarios logueados
    │   ├── admin/          # Rutas específicas para el rol de Administrador
    │   ├── resident/       # Rutas para el rol de Residente
    │   └── layout.tsx      # Layout del dashboard
    ├── api/                # API Routes para lógica de backend
    │   └── [routeName]/route.ts
    ├── components/         # Componentes React reutilizables
    │   └── ui/             # Componentes de UI (botones, inputs, etc.)
    └── lib/                # Lógica compartida, helpers, configuración de Firebase
        └── firebase.ts     # Configuración inicial de Firebase
4. Contexto Clave: Requerimientos del ProyectoTe basarás en los siguientes requerimientos extraídos del documento oficial para guiar el desarrollo.Módulo de Residentes (RF-01 a RF-06)Flujo principal: El residente escanea un QR, se registra con datos básicos, visualiza horarios y puede solicitar servicios adicionales como entrenamientos personalizados.Interacción: Debe poder calificar entrenadores y enviar PQR.Módulo de Administrador (RF-07 a RF-12)Flujo principal: El administrador gestiona su conjunto, actualiza los horarios de las zonas deportivas, monitorea a sus usuarios y genera el QR de acceso.Funcionalidad clave: Debe tener un panel de control para ver a los usuarios registrados y, opcionalmente, restringirles el acceso.Módulo de Entrenadores (RF-13 a RF-14)Flujo principal: El entrenador tiene un perfil público y gestiona su calendario de disponibilidad para que los residentes puedan solicitar sus servicios.Modelo de Negocio (MN-01 a MN-02)Monetización: La plataforma debe incluir un sistema de pagos para los entrenamientos personalizados, con un esquema de comisión del 50% para el entrenador.5. Protocolo de Generación de CódigoCuando te pida implementar una funcionalidad, sigue este protocolo:Identifica los Requerimientos: Menciona los IDs de los requerimientos que vas a implementar (ej. "Implementando RF-01 y RF-02...").Define la Lógica de Backend (Firebase): Describe las funciones y colecciones de Firestore que se necesitarán. Crea la lógica necesaria dentro de una API Route de Next.js (app/api/...) para interactuar con Firebase (ej. crear un usuario en Firestore después del registro en Firebase Auth).Crea los Componentes de Frontend: Escribe el código para los componentes de React (.tsx) necesarios, utilizando Tailwind CSS y FlyonUI. Indica en qué directorio de /components o /app deben crearse.Conecta Frontend y Backend: Muestra cómo el componente de frontend llama a la API Route o interactúa directamente con el SDK de Firebase para ejecutar la lógica.Ejemplo de InteracciónMi Prompt:"Vamos a empezar. Implementa la funcionalidad de registro para residentes, según los requerimientos RF-01 y RF-02."Tu Respuesta Esperada:"Perfecto. Implementaremos el registro de residentes (RF-01, RF-02) usando Next.js y Firebase.1. Lógica de Backend (Firebase y API Route)Crearemos una API Route en Next.js para guardar los datos adicionales del usuario en Firestore después de que Firebase Auth cree la cuenta.app/api/users/route.ts:import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {const { uid, nombre, edad, telefono, notificaciones } = await request.json();try {await addDoc(collection(db, "users"), {uid,nombre,edad,telefono,notificaciones,rol: 'residente'});return NextResponse.json({ message: "Usuario creado exitosamente" }, { status: 201 });} catch (error) {return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });}}
**2. Frontend (Componente de Registro)**
Crearemos el formulario en una página de registro.app/(auth)/register/page.tsx:'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
export default function RegisterPage() {// Estados para el formulario [email, password, nombre, etc.]const handleRegister = async () => {try {const userCredential = await createUserWithEmailAndPassword(auth, email, password);const uid = userCredential.user.uid;  // Llamar a nuestra API Route para guardar datos adicionales
  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, nombre, edad, telefono, notificaciones }),
  });
  // Redirigir al dashboard
} catch (error) {
  console.error("Error en el registro:", error);
}
};return ({/* JSX del formulario con Tailwind y FlyonUI */});}
Este flujo asegura que el residente se registre usando


/////////////////////////////////


Documento de Levantamiento de Requerimientos
Proyecto: Plataforma de Gestión de Zonas Deportivas en Conjuntos Residenciales
Fecha: 3 de Septiembre de 2025
Autor: Juan Andrés Morales

1. Resumen Ejecutivo
El presente documento detalla los requerimientos funcionales y no funcionales para el desarrollo de una plataforma digital destinada a la administración de zonas deportivas (gimnasio y piscina) en conjuntos residenciales. La plataforma constará de tres interfaces principales: un portal para residentes (usuarios finales), un panel de administración para los gestores de cada conjunto residencial y un perfil para los entrenadores.

2. Objetivos del Proyecto
Centralizar la gestión de horarios y usuarios de las zonas deportivas.

Facilitar el acceso de los residentes a los servicios, horarios e información relevante.

Crear un nuevo canal de negocio a través de la oferta de entrenamientos personalizados.

Automatizar procesos de notificaciones y gestión de usuarios para reducir la carga administrativa.

3. Roles de Usuario
Residente: Usuario final que accede a las zonas deportivas y servicios.

Administrador de Conjunto: Responsable de la gestión de su respectivo conjunto, usuarios y horarios.

Entrenador: Profesional que ofrece sus servicios a través de la plataforma.

4. Requerimientos Funcionales
4.1. Módulo de Residentes
|

| ID | Requerimiento | Descripción | Prioridad |
| RF-01 | Registro de Usuario por QR | Los residentes se registrarán escaneando un código QR único ubicado en las zonas deportivas de su conjunto. | Alta |
| RF-02 | Formulario de Registro | El formulario de registro deberá solicitar: nombre, edad, correo electrónico, teléfono y una opción para aceptar/rechazar notificaciones. | Alta |
| RF-03 | Visualización de Horarios | Una vez registrados, los usuarios podrán ver los horarios disponibles para el gimnasio y la piscina de su conjunto. | Alta |
| RF-04 | Solicitud de Entrenamientos Personalizados | Los usuarios podrán solicitar entrenamientos personalizados a través de un formulario, donde seleccionarán el entrenador y el tipo de entrenamiento. | Media |
| RF-05 | Calificación de Entrenadores | Los usuarios podrán calificar a los entrenadores después de un servicio. | Media |
| RF-06 | Sistema de PQR | Se implementará un sistema para que los usuarios puedan registrar Peticiones, Quejas y Reclamos. | Baja |

4.2. Módulo de Administrador de Conjunto
| ID | Requerimiento | Descripción | Prioridad |
| RF-07 | Gestión de Conjuntos | Los administradores podrán registrar y gestionar la información de su conjunto residencial. | Alta |
| RF-08 | Actualización de Horarios | Los administradores podrán actualizar los horarios de las diferentes zonas deportivas (gimnasio, piscina, etc.). | Alta |
| RF-09 | Monitoreo de Usuarios | Los administradores podrán visualizar la lista de usuarios registrados en su conjunto. | Alta |
| RF-10 | Generación de Códigos QR | La plataforma permitirá a los administradores generar y descargar el código QR específico para su conjunto. | Alta |
| RF-11 | Gestión de Usuarios del Conjunto | Los administradores podrán gestionar a sus usuarios (ej. ver información de contacto). | Media |
| RF-12 | Restricción de Acceso (Opcional) | Se evaluará la posibilidad de que los administradores puedan restringir el acceso a usuarios morosos. | Baja |

4.3. Módulo de Entrenadores
| ID | Requerimiento | Descripción | Prioridad |
| RF-13 | Perfil del Entrenador | Los entrenadores tendrán un perfil con su información: cédula, código asignado, nombre, correo, celular, datos personales y contacto de emergencia. | Alta |
| RF-14 | Calendario de Disponibilidad | Los entrenadores podrán gestionar y mostrar su calendario de disponibilidad para servicios personalizados. | Media |

4.4. Módulo de Notificaciones
| ID | Requerimiento | Descripción | Prioridad |
| RF-15 | Notificaciones a Usuarios | La aplicación enviará notificaciones push o por correo (según preferencia del usuario) sobre recordatorios, eventos o cambios de horario. | Media |
| RF-16 | Gestión de Cancelaciones | Los usuarios podrán cancelar o reprogramar servicios a través de la plataforma, automatizando el proceso. | Media |

5. Modelo de Negocio
| ID | Requerimiento | Descripción | Prioridad |
| MN-01 | Sistema de Pagos | Se implementará un sistema de pago para los servicios de entrenamiento personalizado. | Media |
| MN-02 | Comisiones para Entrenadores | Se establecerá un sistema de comisiones para los entrenadores. La propuesta inicial es del 50% para entrenamientos personalizados. | Alta |

6. Requerimientos No Funcionales
| ID | Requerimiento | Descripción |
| RNF-01 | Usabilidad | La interfaz debe ser intuitiva y fácil de usar para todos los roles, especialmente para los residentes que pueden no tener mucha experiencia con tecnología. |
| RNF-02 | Seguridad | La información de los usuarios y conjuntos debe estar protegida. Se debe considerar la encriptación de datos sensibles. |
| RNF-03 | Escalabilidad | La plataforma debe ser capaz de soportar el registro de múltiples conjuntos y un número creciente de usuarios sin degradar el rendimiento. |
| RNF-04 | Disponibilidad | El sistema debe tener una alta disponibilidad para que los usuarios puedan registrarse y consultar horarios en cualquier momento. |
| RNF-05 | Compatibilidad | La aplicación web debe ser compatible con los navegadores más comunes (Chrome, Firefox, Safari) tanto en escritorio como en dispositivos móviles. |