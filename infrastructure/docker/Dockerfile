# syntax=docker/dockerfile:1

FROM node:lts-alpine AS build

ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN}
ARG CADRART_BUILD_VERSION
ENV CADRART_BUILD_VERSION=${CADRART_BUILD_VERSION}

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node .npmrc ./

RUN npm install

COPY --chown=node:node . .

RUN echo "export const cadrartVersion = '${CADRART_BUILD_VERSION}';" > ./src/version.ts

RUN npm run build:prod

# Build the final image

FROM nginxinc/nginx-unprivileged

COPY --from=build /usr/src/app/dist/cadrart2025-frontend/browser /usr/share/nginx/html

COPY nginx.conf  etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
