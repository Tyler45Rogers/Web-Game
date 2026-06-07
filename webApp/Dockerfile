# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

# install deps (including dev for build)
COPY package*.json ./
RUN npm install

# copy sources and build
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# copy built site and node_modules from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3000


CMD ["node", "build"]