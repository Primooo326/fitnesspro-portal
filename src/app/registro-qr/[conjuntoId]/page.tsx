'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Loader';

export default function RegistroPage() {
    const params = useParams();
    const conjuntoId = params.conjuntoId as string;
    const router = useRouter();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        edad: '',
        telefono: '',
    });
    const [conjuntoNombre, setConjuntoNombre] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchConjuntoInfo = async () => {
            if (!conjuntoId) return;
            try {
                const res = await fetch(`/api/conjuntos/${conjuntoId}`);
                if (res.ok) {
                    const data = await res.json();
                    setConjuntoNombre(data.nombre);
                } else {
                    setError('No se pudo encontrar el conjunto residencial.');
                }
            } catch (err) {
                setError('Error al conectar con el servidor.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchConjuntoInfo();
    }, [conjuntoId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    edad: parseInt(formData.edad, 10),
                    conjuntoId,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
                setTimeout(() => router.push('/login'), 2000); // Redirigir al login
            } else {
                setError(data.error || 'Ocurrió un error en el registro.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor para el registro.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !conjuntoNombre) return <Loader />;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {conjuntoNombre ? (
                    <>
                        <h1 className="text-2xl font-bold text-center">
                            Registro para <span className="text-blue-600">{conjuntoNombre}</span>
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {Object.entries(formData).map(([key, value]) => (
                                <div key={key}>
                                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                                        {key === 'password' ? 'Contraseña' : key}
                                    </label>
                                    <input
                                        id={key}
                                        name={key}
                                        type={key === 'password' ? 'password' : key === 'email' ? 'email' : key === 'edad' ? 'number' : 'text'}
                                        value={value}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 mt-1 border rounded-md"
                                        required
                                    />
                                </div>
                            ))}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registrando...' : 'Registrarse'}
                            </button>
                        </form>
                    </>
                ) : (
                    <h1 className="text-2xl font-bold text-center text-red-600">
                        {error || 'Conjunto no especificado.'}
                    </h1>
                )}

                {error && <p className="text-sm text-center text-red-500">{error}</p>}
                {success && <p className="text-sm text-center text-green-500">{success}</p>}

                <div className="text-sm text-center">
                    <Link href="/login" className="font-medium text-blue-600 hover:underline">
                        ¿Ya tienes una cuenta? Inicia Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
