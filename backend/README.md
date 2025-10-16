# Guest Manager - Backend API# 🎯 Guest Manager - Backend API<p align="center">



Backend API built with NestJS, Prisma, PostgreSQL (Neon), and Redis.  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>



## Quick StartBackend API built with NestJS, Prisma, PostgreSQL (Neon), and Redis.</p>



### Prerequisites

- Node.js >= 18

- npm >= 8## 🚀 Quick Start[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

- Neon PostgreSQL account (free tier available)

- Docker (optional, for local Redis)[circleci-url]: https://circleci.com/gh/nestjs/nest



### Installation### Prerequisites



1. Install dependencies:- Node.js >= 18  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

```bash

npm install- npm >= 8    <p align="center">

```

- Neon PostgreSQL account (free tier available)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

2. Setup Neon PostgreSQL:

   - Go to https://console.neon.tech- Docker (optional, for local Redis)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

   - Create a new project (free tier)

   - Copy your connection string<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

   - Paste it in `.env` file as `DATABASE_URL`

### Installation<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

3. Configure environment variables:

```bash<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

cp .env.example .env

```1. **Install dependencies:**<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>



4. Run migrations:   ```bash<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

```bash

npx prisma migrate dev --name init   npm install  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

```

   ```    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

5. Generate Prisma Client:

```bash  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

npx prisma generate

```2. **Setup Neon PostgreSQL:**</p>



### Running the app   - Go to https://console.neon.tech  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)



Development mode:   - Create a new project (free tier)  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

```bash

npm run start:dev   - Copy your connection string

```

   - Paste it in `.env` file as `DATABASE_URL`## Description

The API will be available at: `http://localhost:3000/api/v1`



### Redis Setup (Optional for cache)

3. **Configure environment variables:**[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Using Docker:

```bash   ```bash

docker-compose up -d

```   cp .env.example .env## Project setup



## Development   # Edit .env with your actual credentials



### Prisma Commands   ``````bash



```bash$ npm install

# Open Prisma Studio (GUI for database)

npx prisma studio4. **Run migrations:**```



# Create a new migration   ```bash

npx prisma migrate dev --name migration_name

   npx prisma migrate dev --name init## Compile and run the project

# Generate Prisma Client

npx prisma generate   ```

```

```bash

### Testing

5. **Generate Prisma Client:**# development

```bash

# Unit tests   ```bash$ npm run start

npm run test

   npx prisma generate

# E2E tests

npm run test:e2e   ```# watch mode



# Test coverage$ npm run start:dev

npm run test:cov

```6. **Seed database (optional):**



## Next Steps   ```bash# production mode



- [ ] Create Guests module with CRUD operations   npx prisma db seed$ npm run start:prod

- [ ] Implement Redis cache

- [ ] Add Swagger documentation   ``````

- [ ] Create seed data

- [ ] Add bulk operations

- [ ] Implement export endpoints

### Running the app## Run tests



#### Development mode```bash

```bash# unit tests

npm run start:dev$ npm run test

```

# e2e tests

#### Production mode$ npm run test:e2e

```bash

npm run build# test coverage

npm run start:prod$ npm run test:cov

``````



The API will be available at: `http://localhost:3000/api/v1`## Deployment



### Redis Setup (Optional for cache)When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.



#### Using Docker (Recommended):If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash

docker-compose up -d```bash

```$ npm install -g @nestjs/mau

$ mau deploy

#### Using Redis Cloud:```

1. Go to https://redis.com/try-free/

2. Create a free databaseWith Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

3. Update `.env` with your Redis URL

## Resources

## 📚 API Documentation

Check out a few resources that may come in handy when working with NestJS:

Once the server is running, Swagger documentation will be available at:

- http://localhost:3000/api/docs- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

## 🛠️ Development- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

### Prisma Commands- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

```bash- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

# Open Prisma Studio (GUI for database)- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

npx prisma studio

## Support

# Create a new migration

npx prisma migrate dev --name migration_nameNest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).



# Reset database (⚠️ Development only!)## Stay in touch

npx prisma migrate reset

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

# Generate Prisma Client- Website - [https://nestjs.com](https://nestjs.com/)

npx prisma generate- Twitter - [@nestframework](https://twitter.com/nestframework)

```

## License

### Testing

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📂 Project Structure

```
backend/
├── src/
│   ├── prisma/              # Prisma module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── guests/              # Guests feature module (to be created)
│   ├── cache/               # Cache module (to be created)
│   ├── export/              # Export module (to be created)
│   ├── common/              # Shared utilities
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration files
│   └── seeds/               # Seed data
├── test/
├── .env
├── .env.example
└── docker-compose.yml       # Redis container
```

## 🔧 Configuration

All configuration is done through environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | Neon PostgreSQL connection string | Required |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |
| `CACHE_TTL` | Cache TTL in seconds | `300` |

## 🚢 Deployment

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render
1. Connect your GitHub repo
2. Add environment variables
3. Deploy

### Fly.io
```bash
# Install Fly CLI
# Follow: https://fly.io/docs/hands-on/install-flyctl/

# Launch
fly launch

# Deploy
fly deploy
```

## 📝 Next Steps

- [ ] Create Guests module with CRUD operations
- [ ] Implement Redis cache
- [ ] Add Swagger documentation
- [ ] Create seed data
- [ ] Add bulk operations
- [ ] Implement export endpoints

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

MIT
