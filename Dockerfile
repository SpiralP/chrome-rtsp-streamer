FROM node

RUN apt-get -y update
RUN apt-get -y install \
    xvfb \
    udev \
    fonts-freefont-ttf \
    chromium \
    awesome \
    ffmpeg \
    pulseaudio

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
RUN yarn install

COPY --chown=node:node . .
RUN chmod +x ./entrypoint.sh

EXPOSE 80
ENV PORT=80
ENTRYPOINT [ "./entrypoint.sh" ]
