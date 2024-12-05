# Base image
FROM oven/bun AS base
WORKDIR /usr/src/app

# Install dependencies in separate stages for dev and prod
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --production --frozen-lockfile

# Install Redis in a separate stage
FROM base AS redis
RUN apt-get update && apt-get install -y redis-server
RUN mkdir -p /data && chown redis:redis /data
RUN echo "dir /data" >> /etc/redis/redis.conf
RUN echo "bind 0.0.0.0" >> /etc/redis/redis.conf

# Prepare the application for release
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Final production-ready image with Redis
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=redis /usr/bin/redis-server /usr/bin/redis-server
COPY --from=redis /etc/redis/redis.conf /etc/redis/redis.conf

# Set up entrypoint to start Redis and the application
ENTRYPOINT ["/bin/sh", "-c", "redis-server /etc/redis/redis.conf & bun run src/index.ts"]
