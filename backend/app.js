// Import
const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
app.use(cors());
app.options('*', cors());
const authJwt = require('./helpers/jwt');
const api = process.env.API_URL
const errorHandler = require('./helpers/error-handler');


// Middleware 
app.use(express.json());
app.use(morgan('tiny')); //hiển thị các phương thức (post,get,...)
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads' ));

// Import Router
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');

// Router middleware
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);


// Connect to Mongoose DB
mongoose.connect(process.env.CONNECTION_STRING, 
                {useNewUrlParser: true, 
                useUnifiedTopology: true,
            dbName: 'DoAn'} )
.then(()=>{console.log('Connected to database');})
.catch((err)=>{
    console.log(err);
})

// Server on port 3000
app.listen(3000, () => {
    console.log('server is running: http://localhost:3000');
})