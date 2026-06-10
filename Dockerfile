# ── Stage 1: Install dependencies ──────────────────────────
# Called "deps" — we reference it later with --from=deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build the app ──────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from the deps stage (not from your machine)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are baked into the JS bundle at BUILD time.
# The browser reads this URL to know where the backend is.
# ARG = build-time variable, ENV = makes it available to next build
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build

# ── Stage 3: Production runner ──────────────────────────────
# This is the final image — only has what's needed to run.
# Everything from stages 1 and 2 is discarded.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only the built output from stage 2
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
