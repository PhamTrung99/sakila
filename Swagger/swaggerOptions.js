// Extended: https://swagger.io/specification/#infoObject
if (process.env.NODE_ENV !== 'production') { // Nếu app không ở trong chế độ production
  require('dotenv').config(); //Dòng này cho phép đọc file .env 
}
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "SAKILA API",
        version: "1.0.1",
        description: "MOVIES WEB API",
        servers: ["http://localhost:"+process.env.PORT]
      }
    },
    // ['.routes/*.js']
    apis: ["app.js"]
  };

module.exports = swaggerOptions;
