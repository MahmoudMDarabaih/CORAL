import { Sequelize } from 'sequelize';
import dbLogger from './utils/dbLogger';

const DB_NAME: string | undefined = process.env.DB_NAME || 'ecommerce_system';
const DB_USERNAME: string | undefined = process.env.DB_USER || 'root';
const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD || 'password';
const DB_PORT: number | undefined = Number(process.env.DB_PORT) || 3306;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: dbLogger,
});

export default sequelize;
