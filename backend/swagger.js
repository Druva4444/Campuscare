// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campus Care Connect API',
      version: '1.0.0',
      description: 'API documentation for Campus Care Connect project',
    },
    servers: [
      {
        url: 'http://localhost:3020', // change if needed
      },
    ],
  },
  apis: ['./routes/AdminRouter.js' , './routes/DoctorRouter.js' , './routes/StudentRouter.js', './routes/SuserAdmin.js']  , // path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
