FROM hypriot/rpi-node:latest

RUN mkdir -p /usr/bin/app
COPY . /usr/bin/app

WORKDIR /usr/bin/app
RUN npm install -g yarn
RUN yarn

EXPOSE 4000
CMD ["yarn", "app"]
