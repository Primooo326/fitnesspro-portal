// --- Enumeraciones para Tipos y Estados ---

/**
 * Roles de usuario definidos en el sistema.
 */
export enum RolUsuario {
    RESIDENTE = 'Residente',
    ADMINISTRADOR = 'Administrador de Conjunto',
    ENTRENADOR = 'Entrenador',
    SUPER = 'Super Administrador',
}

/**
 * Estados posibles para una Petición, Queja o Reclamo (PQR).
 */
export enum EstadoPQR {
    ABIERTO = 'Abierto',
    EN_PROCESO = 'En Proceso',
    CERRADO = 'Cerrado',
}

/**
 * Tipos de Petición, Queja o Reclamo (PQR).
 */
export enum TipoPQR {
    PETICION = 'Petición',
    QUEJA = 'Queja',
    RECLAMO = 'Reclamo',
}

/**
 * Preferencias de notificación del usuario.
 */
export enum PreferenciaNotificacion {
    EMAIL = 'Correo Electrónico',
    PUSH = 'Notificación Push',
}

/**
 * Estado de un servicio de entrenamiento para su gestión. 
 */
export enum EstadoServicio {
    SOLICITADO = 'Solicitado',
    CONFIRMADO = 'Confirmado',
    COMPLETADO = 'Completado',
    CANCELADO = 'Cancelado',
    REPROGRAMADO = 'Reprogramado',
}

/**
 * Estado del pago para los servicios de entrenamiento. 
 */
export enum EstadoPago {
    PENDIENTE = 'Pendiente',
    PAGADO = 'Pagado',
}

// --- Interfaces de Usuarios ---

/**
 * Interfaz base para cualquier usuario del sistema.
 */
export interface UsuarioBase {
    id: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
}

/**
 * Representa a un residente del conjunto. 
 */
export interface Residente extends UsuarioBase {
    rol: RolUsuario.RESIDENTE;
    edad: number;
    telefono: string;
    conjuntoId: string; // Vincula al residente con su conjunto
    aceptaNotificaciones: boolean;
    preferenciaNotificacion?: PreferenciaNotificacion;
    accesoRestringido?: boolean;// Para la funcionalidad opcional RF-12 
}

/**
 * Representa al administrador de un conjunto residencial.
 */
export interface AdministradorConjunto extends UsuarioBase {
    rol: RolUsuario.ADMINISTRADOR;
    conjuntoId: string; // El conjunto que administra
    telefono: string;
    correo: string;
}

/**
 * Representa al entrenador que ofrece servicios. 
 */
export interface Entrenador extends UsuarioBase {
    rol: RolUsuario.ENTRENADOR;
    cedula: string;// 
    codigoAsignado: string;// 
    celular: string;// 
    datosPersonales: string;// Información adicional 
    contactoEmergencia: {
        nombre: string;
        telefono: string;
    };// 
    disponibilidad: Disponibilidad[];// Calendario de disponibilidad 
    calificaciones: Calificacion[];// Calificaciones recibidas
    comision: number;// Porcentaje de comisión, ej: 0.50 para 50% 
}

// --- Interfaces de Gestión del Conjunto ---

/**
 * Representa una zona deportiva dentro de un conjunto. 
 */
export interface ZonaDeportiva {
    id: string;
    nombre: 'Gimnasio' | 'Piscina' | string; // Nombres comunes
    horarios: Horario[];// Horarios de la zona 
}

/**
 * Representa un bloque de horario para una zona deportiva. 
 */
export interface Horario {
    id: string;
    dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
    horaInicio: string; // Formato HH:mm
    horaFin: string; // Formato HH:mm
}

/**
 * Representa a un conjunto residencial. 
 */
export interface ConjuntoResidencial {
    id: string;
    nombre: string;// 
    codigoQR: string;// URL o data del QR para registro 
    zonasDeportivas: ZonaDeportiva[];// 
    usuarios: Residente[];// Lista de usuarios del conjunto 
}

// --- Interfaces de Módulos Funcionales ---

/**
 * Representa la solicitud de un entrenamiento personalizado.
 */
export interface EntrenamientoPersonalizado {
    id: string;
    residenteId: string;
    entrenadorId: string;
    tipoEntrenamiento: string;
    fecha: Date;
    estado: EstadoServicio;
    pago?: Pago;// Información de pago 
}

/**
 * Representa una calificación hecha por un usuario a un entrenador.
 */
export interface Calificacion {
    id: string;
    residenteId: string;
    entrenadorId: string;
    puntuacion: 1 | 2 | 3 | 4 | 5;
    comentario?: string;
    fecha: Date;
}

/**
 * Representa una PQR (Petición, Queja o Reclamo).
 */
export interface PQR {
    id: string;
    residenteId: string;
    tipo: TipoPQR;
    descripcion: string;
    estado: EstadoPQR;
    fechaCreacion: Date;
    fechaCierre?: Date;
}

/**
 * Representa una notificación para ser enviada a un usuario. 
 */
export interface Notificacion {
    id: string;
    usuarioId: string;
    mensaje: string;
    tipo: 'Recordatorio' | 'Evento' | 'Cambio de Horario';
    leida: boolean;
    fechaEnvio: Date;
}

/**
 * Representa la información de un pago realizado. 
 */
export interface Pago {
    id: string;
    entrenamientoId: string;
    monto: number;
    comisionEntrenador: number;// Monto de la comisión 
    fechaPago: Date;
    estado: EstadoPago;
    idTransaccion?: string; // ID de la pasarela de pagos
}

/**
 * Representa un bloque de disponibilidad en el calendario de un entrenador. 
 */
export interface Disponibilidad {
    id: string;
    fecha: Date; // Día específico
    horaInicio: string; // Formato HH:mm
    horaFin: string; // Formato HH:mm
    disponible: boolean;
}