// ============================================
// RUTAS DE COLECCIONES FIRESTORE
// ============================================
// Todas las colecciones están en la raíz de Firestore
// Los IDs de documentos de usuarios coinciden con el UID de Firebase Auth

export const COLLECTIONS = {
    USERS: 'proyectos/FITNESSPRO/users',
    CONJUNTOS: 'proyectos/FITNESSPRO/conjuntos',
    ZONAS: 'proyectos/FITNESSPRO/zonas',
    HORARIOS: 'proyectos/FITNESSPRO/horarios',
    EVENTOS: 'proyectos/FITNESSPRO/eventos',
    ACTIVIDADES: 'proyectos/FITNESSPRO/actividades',
    INSCRIPCIONES: 'proyectos/FITNESSPRO/inscripciones',
    PQRS: 'proyectos/FITNESSPRO/pqrs',
    ENTRENAMIENTOS: 'proyectos/FITNESSPRO/entrenamientos',
    CALIFICACIONES: 'proyectos/FITNESSPRO/calificaciones',
    PAGOS: 'proyectos/FITNESSPRO/pagos',
} as const;

// Mantener compatibilidad con código existente (deprecado)
/** @deprecated Usar COLLECTIONS.USERS en su lugar */
export const PATH_USERS = COLLECTIONS.USERS;
/** @deprecated Usar COLLECTIONS.CONJUNTOS en su lugar */
export const PATH_CONJUNTOS = COLLECTIONS.CONJUNTOS;
/** @deprecated Usar COLLECTIONS.HORARIOS en su lugar */
export const PATH_HORARIOS = COLLECTIONS.HORARIOS;
/** @deprecated Usar COLLECTIONS.EVENTOS en su lugar */
export const PATH_EVENTOS = COLLECTIONS.EVENTOS;
/** @deprecated Usar COLLECTIONS.ACTIVIDADES en su lugar */
export const PATH_ACTIVIDADES = COLLECTIONS.ACTIVIDADES;
/** @deprecated Usar COLLECTIONS.INSCRIPCIONES en su lugar */
export const PATH_INSCRIPCIONES = COLLECTIONS.INSCRIPCIONES;

// ============================================
// RUTAS DE NAVEGACIÓN POR ROL
// ============================================

export const sidebarRoutes = {
    superadmin: [
        { name: 'Dashboard', href: '/superadmin' },
        { name: 'Conjuntos', href: '/superadmin/conjuntos' },
        { name: 'Usuarios', href: '/superadmin/users' },
        { name: 'Entrenadores', href: '/superadmin/trainers' },
    ],
    admin: [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Usuarios', href: '/admin/users' },
        { name: 'Zonas', href: '/admin/zonas' },
    ],
    trainer: [
        { name: 'Dashboard', href: '/trainer' },
        { name: 'Perfil', href: '/trainer/perfil' },
        { name: 'Horarios', href: '/trainer/horarios' },
        { name: 'Actividades', href: '/trainer/actividades' },
        { name: 'Inscripciones', href: '/trainer/inscripciones' },
    ],
    resident: [
        { name: 'Dashboard', href: '/resident' },
        { name: 'Perfil', href: '/resident/perfil' },
        { name: 'Horarios', href: '/resident/horarios' },
        { name: 'Actividades', href: '/resident/actividades' },
        { name: 'Inscripciones', href: '/resident/inscripciones' },
    ]
} as const;

// ============================================
// RUTAS HOME POR ROL
// ============================================

export const HOME_ROUTES = {
    'Super Administrador': '/superadmin',
    'Administrador de Conjunto': '/admin',
    'Entrenador': '/trainer',
    'Residente': '/resident',
} as const;