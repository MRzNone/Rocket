# Stage 1 - the build process
FROM node:12.2.0-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Stage 2 - the production environment
# FROM nginx:1.12-alpine
FROM nginx:1.15
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY --from=build-deps /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# # DEV
# FROM node:12.2.0-alpine
# WORKDIR /usr/src/app
# COPY package.json yarn.lock ./
# RUN yarn
# COPY . ./
# EXPOSE 3000
# CMD ["yarn", "start"]