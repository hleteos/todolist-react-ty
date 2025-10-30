export default {
    darkMode: 'class', // ← Clave para el modo oscuro manual
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Asegura que escanee todos tus archivos
    ],
    theme: {
      extend: {
        fontFamily: {
          jakarta: ['"Plus Jakarta Sans"', 'sans-serif'], // Usar como 'font-jakarta'
        }
      },
    },
    plugins: [],
  }