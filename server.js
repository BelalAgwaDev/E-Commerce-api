
const path = require('path');
const express = require("express")
const dotenv = require('dotenv')
const morgan = require('morgan')
const ApiError = require('./utils/apiError/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const UserRoute = require('./routes/userRoute');

dotenv.config({ path: "config.env" })

//connection with db
dbConnection()

//express app
const app = express()

// Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname,"uploads")))

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
    console.log(process.env.NODE_ENV)

}



//mount Routes
app.use("/api/v1/categories", categoryRoute)
app.use("/api/v1/subCategories", subCategoryRoute)
app.use("/api/v1/brands", brandRoute)
app.use("/api/v1/products", productRoute)
app.use("/api/v1/users", UserRoute)


// route error
app.all("*", (req, res, next) => {
    next(new ApiError(`can't find this route : ${req.originalUrl}`, 400))
})


// Global error handling middleware
app.use(globalError)

// server node
const server =app.listen(process.env.PORT || 8000, () => {
    console.log("App running on port");
})



//handle rejection outside express
process.on("unhandledRejection", (err) => {
    console.error(`unhandled Rejection Error : ${err.name} | ${err.message}`)
    server.close(()=>{
        console.error(`server shutting down...`)
        process.exit(1)
    })
    
})