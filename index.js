const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {connectToServer} = require('./utils/dbConnect');

const app = express();
const port = process.env.PORT || 5000;

const errorHandler = require("./middleware/errorHandler");
const toolsRoutes = require("./routes/v1/tools.route.js")
const usersRoutes = require("./routes/v1/users.router")
const reviewsRoutes = require("./routes/v1/reviews.router")
// const ordersRoutes = require("./routes/v1/orders.router")



app.use(cors());
app.use(express.json());


connectToServer((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } else {
    console.log(err);
  }
});


app.use("/api/v1/tools" , toolsRoutes)
// app.use("/api/v1/orders" , ordersRoutes)
app.use("/api/v1/users" , usersRoutes)
app.use("/api/v1/reviews" , reviewsRoutes)



app.get('/', (req, res) => {
  res.send('Server is running')
})

app.all('*' , (req, res) => {
  res.send("No Route Found")
})


app.use(errorHandler);


process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});