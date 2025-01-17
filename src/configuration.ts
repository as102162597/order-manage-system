import { config } from './config/config';

const environment = Object.keys(config).includes(process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : 'development';

export const configuration = config[environment];
