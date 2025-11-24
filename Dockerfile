# Usa una imagen base de Node.js
FROM node:18

ENV TZ=America/Argentina/Buenos_Aires

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos necesarios para la instalación de dependencias
COPY app_tutores_backoffice_sveltekit/package.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY app_tutores_backoffice_sveltekit/ .

# Argumento para recibir el archivo de entorno
ARG ENV_FILE=.env

# Copia el archivo de entorno seleccionado al contenedor
COPY ${ENV_FILE} .env

# Corre el build de la aplicación
RUN npm run build

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "BODY_SIZE_LIMIT=Infinity PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build/index.js"]
