#########################
# INSTALAR DEPENDENCIAS #
#########################
FROM node:19-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN rm -rf node_modules && \
  yarn config set "strict-ssl" false -g &&\
  yarn install --frozen-lockfile

COPY --chown=node:node . .

USER node

############################
# COMPILAR PARA PRODUCCION #
############################
FROM node:19-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production

RUN yarn config set "strict-ssl" false -g &&\
  yarn install --frozen-lockfile --production && \
  yarn cache clean --all

USER node

######################
# EJECUTA APLICACION #
######################
FROM node:19-alpine As production

WORKDIR /app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
