const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
require('express-async-errors');

const swagOption = require('./swagger/swaggerOptions');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { use } = require('express/lib/router');

if (process.env.NODE_ENV !== 'production') { // Nếu app không ở trong chế độ production
  require('dotenv').config(); //Dòng này cho phép đọc file .env 
}

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


app.get('/', function (req, res) {
  res.json({
    message: 'Hello from Sakila API'
  });
})

app.use('/api/films', require('./routes/film.route'));
app.use('/api/actor', require('./routes/actor.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/auth', require('./routes/auth.route'));

const swaggerDocs = swaggerJsDoc(swagOption());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('/err', function (req, res) {
  throw new Error('Error!');
})

app.use(function (req, res, next) {
  res.status(404).json({
    error_message: 'Endpoint not found'
  });
})

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    error_message: 'Something broke!'
  });
})


app.listen(process.env.PORT, function () {
  console.log(`Sakila api is running at http://localhost:${process.env.PORT}`);
})








/**
 * @swagger
 * openapi: 3.0.0
 * securityDefinitions:
 *  Bearer:
 *    type: apiKey
 *    name: x-access-token
 *    in: header
 * tags:
 *  - name: actor
 *  - name: user
 * paths:
 *  /api/actor:
 *    get:
 *      security:
 *        - Bearer: []
 *      tags:
 *        - actor
 *      summary: Get list of all actors
 *      parameters: []
 *      responses:
 *       '200':
 *          description: OK
 *          content:
 *            application/json
 *  /api/actor/{id}:
 *    get:
 *      security:
 *        - Bearer: []
 *      tags:
 *        - actor
 *      summary: Get an actor by actor_id
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: integer
 *          format: int64
 *      responses:
 *        '200':
 *          description: OK
 *          content: 
 *            application/json
 * /api/actor:
 *  post:
 *      security:
 *        - Bearer: []
 *      tags:
 *        - actor
 *      summary: Add a new actor
 *      parameters:
 *        - name: body
 *          in: body
 *          required: true
 *      responses:
 *        '201':
 *          description: Return new actor_id added
 *          content: 
 *            application/json
 *        '400':
 *          description: Wrong input
 * /api/actor/{id}:
 *    put:
 *      security:
 *        - Bearer: []
 *      tags:
 *        - actor
 *      summary: Update an actor by actor_id
 *      parameters:
 *        - name: id
 *          in: path
 *          type: integer
 *          format: int64
 *          required: true
 *        - name: body
 *          in: body
 *          required: true
 *      responses:
 *        '200':
 *          description: 0-fail, 1-success
 *          content:
 *            application/json
 *        '400':
 *          description: Wrong Input
 * /api/user/:
 *    post:
 *      security:
 *        - Bearer: []
 *      tags:
 *        - user
 *      summary: signup new user
 *      parameters: 
 *        - name: body
 *          in: body
 *          description: User information signup{name, username, password}
 *          required: true
 *      responses:
 *        '201':
 *          description: created success
 *          content:
 *            application/json
 * /api/auth/:
 *    post:
 *      tags:
 *        - user
 *      summary: User Login
 *      parameters:
 *        - name: body
 *          in: body
 *          description: Username, password
 *          required: true
 *      responses:
 *        '200':
 *          description: login success
 *          content:
 *            application/json
 * /api/auth/refresh/:
 *    post:
 *      tags:
 *        - user
 *      summary: take a new access token
 *      parameters:
 *        - name: body
 *          in: body
 *          description: {accesstoken, refreshtoken}
 *          required: true
 *      responses:
 *        '200':
 *          description: return new access token 
 *          content:
 *            application/json
 
 */

