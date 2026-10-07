# start from an image with Bun, and work in /app
FROM oven/bun:1-alpine
WORKDIR /app
# the package list first (a cached layer), then exact versions from bun.lock
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
# then the rest of the code
COPY . .
ENV NODE_ENV=production
# the app's port, and what runs when the container starts
EXPOSE 3000
CMD ["bun", "run", "start"]
