<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Descripción.

Api rest para Witsoft Group

## Configuración

1. ***Variables de entorno***: El archivo ```.env.template``` en la raíz del proyecto sirve como guía de todas las opciones de configuración de la aplicación.
Copie y renombre el archivo a ```.env.\${NODE_ENV}``` ó ```.env```, donde ${NODE_ENV} es la variable de entorno del sistema.
La prioridad de carga para variables de entorno es: variables del sistema, archivo .env.\${NODE_ENV} y por ultimo el archivo .env.

## Instalaciones.

1. Gestor de dependencias, typescript, Nest CLI de forma globales:
```bash
$ npm i -g yarn typescript @nestjs/cli
```

2. Dependencias del proyecto:
```bash
$ yarn install
```

## Ejecutar la aplicación

```bash
# modo desarrollo
$ yarn start:dev

# modo producción directo
$ yarn build

# modo producción con construcción
$ yarn build
$ yarn start:prod
```

## Ejecutar la aplicación en entorno docker

Docker compose creara un entorno con los recursos necesarios y una instancia de la aplicación compilada a partir del Dockerfile en la ruta raíz del proyecto.
Puede ejecutar en una version de la aplicación con los comandos de la sección anterior y utilizar los recursos del docker compose, solo recuerde cambiar el puerto (PORT) de la aplicación a uno diferente del 8080 para chocar con la instancia de docker compose.

```bash
# levantar los recursos y la aplicación (cambie ./.env.development por el nombre dsu archivo con las variables de entorno)
$ docker compose --env-file ./.env.development up -d
# mongo db expuesta por puerto indicado en la variable DB_PORT
# cliente mongo express para administración expuesto en el puerto 8081
# aplicación expuesta en el puerto 8080

# recargar aplicación (reconstruye la imagen de la aplicación con los cambios actuales)
$ docker compose --env-file ./.env.development up -d --build

# detener los recursos y la aplicación
$ docker compose --env-file ./.env.development down
```

## Test

```bash
# test unitarios
$ yarn test

# test e2e
$ yarn test:e2e

# cobertura
$ yarn test:cov
```

## Soporte

[Witsoft Group](https://github.com/WitsoftGroup).
