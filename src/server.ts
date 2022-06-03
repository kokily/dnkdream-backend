import 'dotenv/config';
import https from 'https';
import http from 'http';
import fs from 'fs';
import app from './app';
import entities from './entities';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: false,
  entities,
});

const _bootStrap = async () => {
  try {
    await dataSource.initialize();

    const configurations = {
      production: { ssl: true, port: 443, hostname: 'api.dnkdream.com' },
      development: { ssl: false, port: 4000, hostname: 'localhost' },
    };
    const environment = process.env.NODE_ENV || 'production';
    const config = configurations[environment];

    let server;

    if (config.ssl) {
      server = https.createServer(
        {
          key: fs.readFileSync(`${process.env.SSL_KEY}`),
          cert: fs.readFileSync(`${process.env.SSL_CERT}`),
        },
        app.callback()
      );
    } else {
      server = http.createServer(app.callback());
    }

    await server.listen(config.port, () => {
      console.log(`> D&K Dreams Backend API Server on ${config.port} port`);
    });
  } catch (err: any) {
    console.log(err);
  }
};

_bootStrap();
