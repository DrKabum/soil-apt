FROM oven/bun:1 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/index.ts .
COPY --from=prerelease /usr/src/app/commands/. commands/.
COPY --from=prerelease /usr/src/app/chat-gpt/. chat-gpt/.
COPY --from=prerelease /usr/src/app/helpers/. helpers/.
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/container-entrypoint.sh .

# run the app
USER bun
EXPOSE 3001/tcp
ENTRYPOINT [ "sh", "container-entrypoint.sh" ]