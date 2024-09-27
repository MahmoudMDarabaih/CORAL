import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Application } from 'express';
import path from 'path';

// Load the YAML file
const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger-docs/swagger.yaml'));

export const setupSwagger = (app: Application): void  => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
