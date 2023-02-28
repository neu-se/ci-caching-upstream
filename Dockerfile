FROM alatas/squid-alpine-ssl:r3

RUN apk update && \
    apk add --update nodejs