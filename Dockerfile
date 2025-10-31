# 1. ¿Cuál es la imagen base? 
# Usaremos una imagen oficial que ya tenga Node.js (versión 18, "alpine" es una versión ligera)
FROM node:18-alpine

# 2. ¿Dónde queremos trabajar dentro del contenedor?
# Creamos una carpeta /app y nos movemos a ella
WORKDIR /app

# 3. ¿Qué archivos necesitamos primero?
# Copiamos la lista de dependencias
COPY package.json package-lock.json ./

# 4. ¿Qué comandos de preparación ejecutamos?
# Instalamos las dependencias del proyecto
RUN npm install

# 5. ¿Qué más copiamos?
# Ahora sí, copiamos el RESTO del código de tu proyecto
COPY . .

# (Opcional) Si tu app usa un puerto (ej. 3000 para React/Next.js)
# le "avisamos" a Docker que este puerto se usará.
EXPOSE 3000

# 6. ¿Cuál es el comando final para arrancar la app?
# Esto es lo mismo que escribir "npm start" en tu terminal
CMD ["npm", "start"]