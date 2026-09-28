'use client'
import { useEffect } from 'react';

export default function RegistroServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registrado'))
        .catch((error) => console.error('Error al registrar:', error));
    }
  }, []);
  return null;
}