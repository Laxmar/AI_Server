FROM node:8.9.4

WORKDIR /app

ADD . /app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /git app/node_modules/.bin:$PATH

ADD package.json /app/package.json
RUN npm install

EXPOSE 8000

#RUN tsc
CMD ["npm", "start"]
