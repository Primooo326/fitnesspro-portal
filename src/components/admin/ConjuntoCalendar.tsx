'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configuración del localizador para date-fns en español
const locales = {
    'es': es,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});


export default function ConjuntoCalendar() {
    // Por ahora, los eventos estarán vacíos
    const events: any[] = [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md" style={{ height: '500px' }}>
            <h2 className="text-2xl font-bold mb-4">Calendario de Eventos del Conjunto</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 400 }}
                messages={{
                    next: "Siguiente",
                    previous: "Anterior",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay eventos en este rango.",
                    showMore: total => `+ Ver más (${total})`
                }}
            />
        </div>
    );
}