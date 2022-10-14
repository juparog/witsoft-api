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
$ npm run start

# modo desarrollo con recarga automática
$ npm run start:dev

# modo producción
$ npm run start:prod
```

## Test

```bash
# test unitarios
$ npm run test

# test e2e
$ npm run test:e2e

# cobertura
$ npm run test:cov
```

## Soporte

[Witsoft Group](https://github.com/WitsoftGroup).
