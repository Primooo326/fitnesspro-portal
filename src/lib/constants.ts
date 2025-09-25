export const PATH_USERS = "proyectos/FITNESSPRO/users";
export const PATH_CONJUNTOS = "proyectos/FITNESSPRO/conjuntos";
export const PATH_HORARIOS = "proyectos/FITNESSPRO/horarios";
export const PATH_EVENTOS = "proyectos/FITNESSPRO/eventos";
export const PATH_ACTIVIDADES = "proyectos/FITNESSPRO/actividades";
export const PATH_INSCRIPCIONES = "proyectos/FITNESSPRO/inscripciones";



export const sidebarRoutes = {
    superadmin: [
        { name: 'Conjuntos', href: '/superadmin/conjuntos' },
        { name: 'Usuarios', href: '/superadmin/users' },
        { name: 'Entrenadores', href: '/superadmin/trainers' },
    ],
    admin: [
        { name: 'Usuarios', href: '/superadmin/users' },
        { name: 'Zonas', href: '/admin/zonas' },
    ],
    trainer: [
        { name: 'Perfil', href: '/trainer/perfil' },
        { name: 'Horarios', href: '/trainer/horarios' },
        { name: 'Actividades', href: '/trainer/actividades' },
        { name: 'Inscripciones', href: '/trainer/inscripciones' },
    ],
    resident: [
        { name: 'Perfil', href: '/resident/perfil' },
        { name: 'Horarios', href: '/resident/horarios' },
        { name: 'Actividades', href: '/resident/actividades' },
        { name: 'Inscripciones', href: '/resident/inscripciones' },
    ]
}