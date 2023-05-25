FROM node:alpine as builder

WORKDIR /build
COPY package*.json /build
RUN npm install

FROM node:alpine as first
WORKDIR /app

COPY --from=builder /build /app/
COPY src/ /app/

CMD node index.js

FROM first as second
ENV VERSION=2

FROM first as third
ENV VERSION=3
