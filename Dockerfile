# Stage 1: Build the Vue.js application
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY . .
ARG VITE_CERTIFICAT_URL
ARG VITE_CNI_READER
ARG VITE_CNI_READER_ONLINE
RUN npm install
RUN npm run build

# Stage 2: Serve the built Vue.js application with Nginx
FROM nginx:1.21-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
