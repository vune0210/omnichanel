FROM cgr.dev/chainguard/node:latest-dev AS builder

ARG SERVICE_NAME

USER root

WORKDIR /app

RUN npm install -g pnpm

COPY dist/apps/$SERVICE_NAME .

RUN pnpm install --production

# Final stage
FROM cgr.dev/chainguard/wolfi-base

RUN apk update && apk add --no-cache dumb-init nodejs

WORKDIR /app

COPY --from=builder /app .
COPY --from=builder /usr/local/bin/pnpm /usr/local/bin/

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--" ]
CMD [ "node", "--max-old-space-size=6144", "main.js" ]
