FROM node:alpine

RUN apk --no-cache add \
    xvfb \
    udev \
    ttf-freefont \
    chromium \
    awesome

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
RUN yarn install

COPY --chown=node:node . .

EXPOSE 80
ENV PORT=80
ENTRYPOINT [ "yarn", "start" ]
