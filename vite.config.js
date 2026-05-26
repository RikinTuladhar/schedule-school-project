import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: [
                "**/.git/**",
                "**/node_modules/**",
                "**/vendor/**",
                "**/storage/**",
                "**/public/build/**",
            ],
        },
    },
});
