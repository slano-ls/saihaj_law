import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind(),
        react({
            experimentalReactChildren: true,
            include: ['**/react-components/**/*.{js,jsx,ts,tsx}'],
            exclude: ['**/node_modules/**/*.{js,jsx,ts,tsx}']
        })
    ],
    image: {
        domains: ["github.com"],
    },
    site:
        process.env.NODE_ENV === "development"
            ? "http://localhost:4321"
            : "https://saihajlaw.vercel.app",
});
