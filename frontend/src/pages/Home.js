import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary-800 mb-4">
          Sistema de Gestión de Fichas Técnicas
        </h1>
        <p className="text-xl text-secondary-600 mb-8">
          Gestiona de manera eficiente las fichas técnicas de maquinaria importada
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/crear"
            className="btn-primary px-8 py-3 text-lg"
          >
            Crear Nueva Ficha
          </Link>
          <Link
            to="/fichas"
            className="btn-secondary px-8 py-3 text-lg"
          >
            Ver Fichas Existentes
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">
            Características Principales
          </h2>
          <ul className="space-y-2 text-secondary-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
              Formulario completo con todos los campos requeridos
            </li>
                         <li className="flex items-center">
               <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
               Subida de imágenes (mínimo 1)
             </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
              Generación automática de código QR
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
              Fichas técnicas públicas y accesibles
            </li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">
            Información Requerida
          </h2>
          <ul className="space-y-2 text-secondary-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Datos del pedimento y facturación
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Información técnica (marca, modelo, serie)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Valores en USD y aduana
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Ubicación en planta
            </li>
          </ul>
        </div>
      </div>

      <div className="card text-center">
        <h2 className="text-xl font-semibold text-secondary-800 mb-4">
          ¿Cómo funciona?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-secondary-800 mb-2">Llenar Formulario</h3>
            <p className="text-secondary-600 text-sm">
              Completa todos los campos requeridos y sube las imágenes
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-secondary-800 mb-2">Generar QR</h3>
            <p className="text-secondary-600 text-sm">
              El sistema genera automáticamente un código QR único
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-600 font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-secondary-800 mb-2">Acceso Público</h3>
            <p className="text-secondary-600 text-sm">
              La ficha técnica queda disponible vía QR o enlace directo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 