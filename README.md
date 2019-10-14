# sapper-stress-test

### Requirements

- Node.js 11.x
- yarn 1.x

### Setup

```bash
yarn # install dependencies
yarn generate:pages # generate 1000 product pages
```

### Running the project in development mode

```bash
yarn dev
```

Open up [localhost:3000](http://localhost:3000) and go click products in navigation.

### Static export and serving static files

```bash
yarn export # static export will be done in __sapper__ folder
yarn serve:static # serve static files
```

Open up [localhost:5000](http://localhost:3000) and go click products in navigation.
