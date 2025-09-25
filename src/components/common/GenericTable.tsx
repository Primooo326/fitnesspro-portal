'use client';

import React, { useState } from 'react';
import Pagination from './Pagination';

// Interfaces para las props del componente
export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
}

interface GenericTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    renderActions?: (item: T) => React.ReactNode;
}

export default function GenericTable<T extends { id?: string }>({
    data,
    columns,
    itemsPerPage = 10,
    renderActions,
}: GenericTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Obtener los datos para la página actual
    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    // Función para obtener el valor de una celda
    const getCellValue = (item: T, column: Column<T>) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(item);
        }
        return item[column.accessor] as React.ReactNode;
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.header}>{col.header}</th>
                        ))}
                        {renderActions && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (renderActions ? 1 : 0)} className="p-4 text-center text-gray-500">
                                No hay datos disponibles.
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((item) => (
                            <tr key={item.id || JSON.stringify(item)}>
                                {columns.map((col) => (
                                    <td key={`${item.id}-${col.header}`}>{getCellValue(item, col)}</td>
                                ))}
                                {renderActions && (
                                    <td className="space-x-2">
                                        {renderActions(item)}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}