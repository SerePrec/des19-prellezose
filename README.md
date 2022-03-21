# Desafío 19 - Programación Backend

### CoderHouse

## DIVIDIR EN CAPAS NUESTRO PROYECTO

Retomemos nuestro trabajo para dividir en capas el proyecto como aprendimos.

### Consigna

Dividir en capas el proyecto entregable con el que venimos trabajando (entregable clase 16: loggers y profilers), agrupando apropiadamente las capas de ruteo, controlador, lógica de negocio y persistencia.

Considerar agrupar las rutas por funcionalidad, con sus controladores, lógica de negocio con los casos de uso, y capa de persistencia.

La capa de persistencia contendrá los métodos necesarios para atender la interacción de la lógica de negocio con los propios datos.

### Ejecución

Luego de clonar o descargar el repositorio e instalar todas las dependencias con `npm install`, existen dos comandos para levantar el proyecto.
Para levantarlo en modo de desarrollo junto a nodemon, utilizar `npm run dev`. De lo contrario, para ejecutarlo en "modo producción", utilizar `npm start`.

Se puede pasar por parámetros de argumento dos opciones:
| Opción | Valor | Defecto |
| ------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-p --port --PORT` | Número de puerto de escucha del servidor | 8080 |
| `-m --mode --MODE` | Módo de ejecución del servidor. `FORK` o `CLUSTER` | FORK |

Se puede seleccionar entre dos métodos de persistencia de **datos y sesiones** a través de la variable de entorno `PERS`. El modo `PERS=mongodb_atlas` **(DEFECTO)** para persistir en **MongoDB Atlas** y el modo `PERS=mongodb` para hacer lo mismo en **MongoDB local**

### Vistas

Existen las siguientes vistas que proveen una manera amena de probar el desafío.
Estas vistas se encuentran en las rutas:

- **/** : es la vista principal en donde se encuentra el formulario de carga de productos y el centro de mensajes (chat). Utiliza **websockets**. Requiere autenticación.

- **/login** : formulario de login.

- **/login-error** : vista a la que redirige tras un error en el login.

- **/register** : formulario de registro.

- **/register-error** : vista a la que redirige tras un error en el login.

- **/logout** : vista a la que se accede tras hacer el logout y luego de 5 segundos redirige a home.

- **/productos-mock** : es donde se muestra en una tabla el mock de productos devueltos por la llamada a la API en la ruta de test. Requiere autenticación

- **/info**: muestra información relativa a la app

### API

Consiste en las siguientes rutas:

#### Router /api/productos

| Método | Endpoint                | Descripción                                                        |
| ------ | ----------------------- | ------------------------------------------------------------------ |
| GET    | **/api/productos/**     | Me permite listar todos los productos disponibles                  |
| POST   | **/api/productos/**     | Para incorporar productos al listado                               |
| GET    | **/api/productos/:id**  | Me permite listar un producto por su id                            |
| PUT    | **/api/productos/:id**  | Actualiza un producto por su id. Admite actualizaciones parciales  |
| DELETE | **/api/productos/:id**  | Borra un producto por su id                                        |
| GET    | **/api/productos-test** | Devuelve un listado de 5 productos mock generados con **Faker.js** |

#### Router /api/randoms

| Método | Endpoint         | Descripción                                                                                                                                                                                                                 |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | **/api/randoms** | Devuelve una cantidad de números aleatorios en el rango del 1 al 1000 especificada por parámetros de consulta (query). Por ej: `/api/randoms?cant=20000`. Si dicho parámetro no se ingresa, calcula 100.000.000 de números. |

### Detalles y comentarios

Tomando como base la estructuras de carpetas de los últimos desafíos en donde ya había hecho una división de componentes: **rutas**, **controladores**,**middlewares**, **modelos**, comencé reorganizando la carpeta `models`.
Dentro están los **contenedores** desde donde se extienden los respectivos **DAOs** y un archivo de índice que exporta los DAOs correspondientes.

Moví los dos tipos de errores 404 a su respectivo controlador.

Toda la lógica de negocio fue trasladada desde los controladores (en donde residía hasta ahora) a la capa de servicio. Se dividieron en archivos según la funcionalidad que se encuentran dentro de la carpeta `services`.  
También la lógica de negocios asociada a las validaciones que ofrecen los middlewares fue traslada allí.  
Es está capa la que se comunica con el modelo, evitando el salto de capas. Cada capa realiza su tarea y se la comunica a la capa adyacente ya sea hacía arriba o abajo de la arquitectura.
Tanto controladores como middlewares (que se encuentran en la capa de ruteo), reciben la petición y pasan los datos a la capa de servicio (cuando corresponde) esperando por su respuesta.

Para el caso de los **sockets** ocurre algo similar, donde cada evento tiene asociada una función (controlador). Éste recibe la data y se comunica de ser necesario con la capa de servicio y esta a su vez con el modelo.
