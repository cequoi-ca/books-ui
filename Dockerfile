FROM node:20

COPY ./ /app

WORKDIR /app
RUN npm install
RUN npm install -g ./

RUN mkdir /source

WORKDIR /source

RUN mkdir /adapter

CMD ["mcmasterful-books"]