# DeepL Agent MCP Server — Docker image (Node.js, HTTP transport)
#
# Build:  docker build -t deepl-agent-mcp .
# Run:    docker run -p 3000:3000 -e DEEPL_API_KEY=your_key deepl-agent-mcp
# Note:   Requires a DeepL Enterprise subscription.

FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY node/package*.json ./
RUN npm ci --omit=dev

FROM base AS release
COPY --from=deps /app/node_modules ./node_modules
COPY node/index.mjs ./

ENV MCP_TRANSPORT=http
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "index.mjs"]
