FROM node:alpine as builder

WORKDIR /build
COPY package*.json /build
RUN npm install

FROM node:alpine
WORKDIR /app

COPY --from=builder /build /app/
COPY src/ /app/

CMD node index.js
