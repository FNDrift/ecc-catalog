import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    base: './',
    server: {
        headers: {
            'Content-Security-Policy': 'frame-ancestors *;'
        }
    },
    preview: {
        headers: {
            'Content-Security-Policy': 'frame-ancestors *;'
        }
    }
});
