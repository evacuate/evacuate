FROM mcr.microsoft.com/devcontainers/typescript-node:20

WORKDIR /workspace

COPY ../package.json ../pnpm-lock.yaml ./

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .
