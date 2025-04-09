'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Rocket } from 'lucide-react';

const ComingSoonPage: FC = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                <div className="animate-pulse mx-auto mb-8">
                    <Wrench className="text-6xl text-purple-400 mx-auto" size={48} />
                </div>

                <h1 className="text-5xl font-bold text-gray-100 mb-4">
                    ¡Funcionalidad en camino!
                </h1>

                <p className="text-xl text-gray-300 mb-8">
                    Nuestro equipo está desarrollando esta sección con las últimas tecnologías.
                    ¡Vuelve pronto para descubrir las novedades!
                </p>

                <div className="bg-gray-800 rounded-lg shadow-2xl p-6 mb-8 border border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4 flex items-center justify-center gap-2">
                        <Rocket className="text-purple-400" size={24} />
                        En desarrollo activo 🚀
                    </h2>

                    <p className="text-gray-400 mt-4">
                        Estamos implementando características innovadoras
                        <br />
                        y asegurando la mejor experiencia de usuario
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="bg-purple-700 hover:bg-purple-600 text-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-purple-500/20"
                >
                    Volver al sitio
                </button>
            </div>
        </div>
    );
};

export default ComingSoonPage;