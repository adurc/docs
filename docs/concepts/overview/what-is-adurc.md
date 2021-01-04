---
id: what-is-adurc
title: What is Adurc?
sidebar_label: What is Adurc?
slug: /concepts/overview/what-is-adurc
---

En esta página encontrará una descripción general de qué es Adurc y cómo funciona.

Si quieres empezar con una _practica introductoria_ y aprender sobre la estructura Adurc, dirigete a **[Quickstart](/docs/getting-started/quickstart)**.

Para saber más sobre la _motivación_ por Adurc, revisa la página **[Why Adurc?](/docs/getting-started/quickstart)**.

## ¿Qué es Adurc?
Adurc es un framework [open source](https://github.com/adurc/) para construir ORM de siguiente generación multi proveedores. El principal objetivo es el de evitar el boilerplate convencional causado por los mantenimientos de los diferentes modelos de nuestra aplicación, al mismo tiempo que ofrece flexibilidad para centrarte en la implementación de tu lógica de negocio.

El contexto se basa en los siguientes componentes:

- **Drivers**: Las implementaciones de drivers son los encargados de resolver las peticiones CRUD.
- **Sources**: Son instancias de los drivers asociados a un nombre unico.
- **Models**: Los modelos estan vinculados a un _source_ y esta compuesto por _fields_.
- **Directives**: Las directivas permiten registrar información adicional en los modelos o en alguno de sus campos.

A través de estos conceptos, _Adurc_ es capaz de fusionar peticiones/respuestas de diferentes fuentes de datos a través de la construcción de un **cliente**.

## ¿Cómo funciona Adurc?

### Adurc Builder
Para estandarizar la construcción de Adurc, se proporciona una clase de contrucción denominada: AdurcBuilder.

A través de esta se pueden registrar "builders generators" que serán los encargados de registrar todos los conceptos en el contexto de Adurc.

Veamos un ejemplo muy básico:

```javascript
async function bootstrap(){
  const builder = new AdurcBuilder();
  builder.use(function(ctx){
    ctx.directives.push({...});
    ctx.sources.push({ name: 'main', driver: new SomeDriver() });
    ctx.models.push({...});
  });
  const adurc = await builder.build();
}
bootstrap();
```

#### Adurc Builder Generators
Tal y como se ha visto en el ejemplo anterior, se pueden añadir todos los _builder generators_ que consideremos oportunos, algunos de ellos Adurc los normaliza.

#### Drivers
Los drivers que ha construido Adurc permiten registrarlos como fuentes a través de un builder. Veamos un ejemplo de como se registra una fuente asociada al driver de _Microsoft SQL Server_.

```javascript
builder.use(
  SqlServerDriver.use("main", {
    database: process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      instanceName: process.env.DB_INSTANCE,
    },
  })
);
```

_El ejemplo anterior registra una fuente de datos denominada "main" con un driver MSSQL._

#### Introspectors

Podemos registrar los modelos en el contexto a mano a través de un _builder_.

En el siguiente ejemplo vamos a ver como registramos el modelo "User"

```javascript
builder.use(function(ctx){
  ctx.models.push({
    name: 'User',
    source: 'main',
    directives: [],
    fields: [
      { name: 'id', type: 'int', nonNull: true, directives: [], collection: false },
      { name: 'name', type: 'string', nonNull: true, directives: [], collection: false },
      { name: 'email', type: 'string', nonNull: true, directives: [], collection: false },
      { name: 'age', type: 'int', nonNull: true, directives: [], collection: false },
    ],
  });
})
```

O bien podemos registrar un builder encargado de registrar los modelos por nosotros o a través de un medio diferente.

En este ejemplo, vamos a ver como convertimos un fichero graphql en modelos Adurc:

```javascript
builder.use(GraphQLIntrospector.use({
  path: process.cwd() + '/models/*.graphql',
  encoding: 'utf8',
  defaultSourceName: 'main',
}));
```
El introspector se encargará de recorrer todos los ficheros determinados en el _blob pattern_ y los convertirá a modelos Adurc. El modelo de usuario registrado en el ejemplo inicial, quedaría tal que así:

```graphql
type User  {
  id: ID!
  name: String!
  email: String!
  age: Int!
}
```

#### Exposures

Un exposure recopila toda la información registrada en Adurc y crea dinamicamente una capa de acceso. Las posibilidades son ilimitadas: _REST_, _GraphQL_, _WebSockets_, etc.

En este ejemplo, vamos a ver como registrar un exposure GraphQL respetando el esquema de [ra-data-graphql-simple](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql-simple)

```javascript
builder.use(ReactAdminExposure.use(
  ApolloServer,
  {
    playground: true
  },
  (apollo) => apollo.applyMiddleware({ app, path: '/graphql' })
));
```

#### Summary
En resumen, Adurc Builder va a permitir estandarizar la forma en la que se comparten addons, drivers, etc. Veamos un ejemplo final con los diferentes conceptos implementados:

```javascript
async function bootstrap() {
  const app = express();

  app.use(express.json());

  const builder = new AdurcBuilder();

  builder.use(SqlServerDriver.use('main', {
    database: process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      instanceName: process.env.DB_INSTANCE,
    }
  }));

  builder.use(GraphQLIntrospector.use({
    path: process.cwd() + '/models/*.graphql',
    encoding: 'utf8',
    defaultSourceName: 'main',
  }));

  builder.use(ReactAdminExposure.use(
    ApolloServer,
    {
        playground: true
    },
    (apollo) => apollo.applyMiddleware({ app, path: '/graphql' }),
  ));

  const adurc = await builder.build();

  app.listen(3100);

  console.log(
      'Serving the GraphQL Playground on http://localhost:3000/graphql',
  );
}

bootstrap();
```

### Adurc Client

A través del cliente podremos realizar las tipicas operaciones CRUD+A (Create, Read, Update, Delete & Aggregate). Una vez construido Adurc, expondrá la propiedad "client" que contendrá una propiedad por cada modelo registrado, esta propiedad se normaliza aplicando la convención **camelCase**

Veamos un ejemplo de las operaciones CRUDA:

**C**REATE
```javascript
const adurc = await builder.build();

const newUsers = await adurc.client.user.createMany({
  data: [
    { name: 'Adurc Like', email: 'like@adurc.io', age: 1 },
  ],
  select: {
    id: true
  }
});
```

**R**EAD
```javascript
const users = await adurc.client.user.findMany({
    select: {
        name: true,
    },
});
```

**U**PDATE
```javascript
const usersUpdated = await adurc.client.user.updateMany({
  set: {
    age: 2
  },
  where: {
    age: 1,
  },
  select: {
    id: true,
    name: true,
  }
});
```

**D**ELETE
```javascript
const deleteUsers = await adurc.client.user.deleteMany({
  where: {
    age: 2
  },
  select: {
    id: true,
  }
})
```

**A**GGREGATE
```javascript
const aggregation = await adurc.client.user.aggregate({
  count: true,
  avg: {
    age: true,
  }
});
```

