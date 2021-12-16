FROM node:16
# RUN npm install --global yarn # Already exists
RUN yarn global add @vue/cli
WORKDIR /app
COPY ./MVVM_TWP /app
RUN yarn install

CMD yarn serve --host=0.0.0.0 --port=8181
EXPOSE 8181