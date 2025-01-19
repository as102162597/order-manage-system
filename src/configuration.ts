import { config } from './config/config';

const environment = Object.keys(config).includes(process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : 'development';

config[environment].host =
    process.env.HOST ?? config[environment].host;

config[environment].port =
    process.env.PORT ?? config[environment].port;

config[environment].dbms.host =
    process.env.DBMS_HOST ?? config[environment].dbms.host;

config[environment].dbms.port =
    process.env.DBMS_PORT ?? config[environment].dbms.port;

config[environment].dbms.username =
    process.env.DBMS_USERNAME ?? config[environment].dbms.username;

config[environment].dbms.password =
    process.env.DBMS_PASSWORD ?? config[environment].dbms.password;

config[environment].dbms.database =
    process.env.DBMS_DATABASE ?? config[environment].dbms.database;

export const configuration = config[environment];
