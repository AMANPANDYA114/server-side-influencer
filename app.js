


// const express = require('express');
// const bodyparser = require('body-parser');
// const cors = require('cors');  // Import the CORS package
// const app = express();
// const multer = require('multer');
// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

// const dotenv = require('dotenv');
// dotenv.config({ path: "./.env" });

// const connection = require("./db/db");

// // const errorController = require('./controllers/Error.js');
// const logoutcontroller = require('./controllers/logoutcontroller');

// const adminRoutes = require('./routes/Admin.js');
// const brandRoutes = require('./routes/Brand.js');
// const influencerRoutes = require('./routes/Influecer');
// const managerRoutes = require('./routes/Manager');

// //models
// //  const Influencer=require('./models/influencers')

// //parser for parsing data in body...
// app.use(bodyparser.urlencoded({ extended: false }));
// app.use(bodyparser.json())
// app.use(multer({ dest: '/images' }).single('profile'))

// // Enable CORS for the front-end running on localhost:3000
// const corsOptions = {
//   origin: 'http://localhost:3000',  // Allow requests from localhost:3000
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow only certain methods
//   credentials: true,  // Allow credentials like cookies, authorization headers
// };

// app.use(cors(corsOptions));  // Enable CORS for all routes

// app.get('/', (req, res, next) => {
//     res.send("hello from root");
//     next();
// });

// // Importing all routers...
// app.use('/influencer', influencerRoutes)
// app.use('/admin', adminRoutes)
// app.use('/brand', brandRoutes)
// app.use('/manager', managerRoutes)
// app.get('/logout', (req, res) => {
//     res.clearCookie("jwtoken");
//     try {
//         res.status(200).json({ success: true, message: "Logged out successfully" });
//     } catch (error) {
//         res.status(400).json({ success: false, message: "Something went wrong" });
//     }
// });

// // Default 404 page...
// // app.use(errorController.error404);

// // Connect to database...
// connection();

// const PORT = 8000;

// app.listen(PORT, () => {
//     console.log("Running on server " + PORT);
// });




const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');  
const app = express();
const multer = require('multer');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

const connection = require("./db/db");

// Controllers and routes
const logoutcontroller = require('./controllers/logoutcontroller');
const adminRoutes = require('./routes/Admin.js');
const brandRoutes = require('./routes/Brand.js');
const influencerRoutes = require('./routes/Influecer');
const managerRoutes = require('./routes/Manager');

// Set up the file upload directory
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');  // Use a local directory inside your project

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Configure multer to store uploaded files in the "uploads" directory
app.use(multer({ dest: uploadDir }).single('profile'));  // Change to "uploads" directory

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://influencer-marketing-fe.vercel.app'],  // Allow Vercel frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow only certain methods
    credentials: true,  // Allow credentials like cookies, authorization headers
};


app.use(cors(corsOptions));  

app.get('/', (req, res, next) => {
    res.send("hello from root");
    next();
});

// Importing all routers...
app.use('/influencer', influencerRoutes);
app.use('/admin', adminRoutes);
app.use('/brand', brandRoutes);
app.use('/manager', managerRoutes);

app.get('/logout', (req, res) => {
    res.clearCookie("jwtoken");
    try {
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Something went wrong" });
    }
});

// Connect to database...
connection();

const PORT = 8000;

app.listen(PORT, () => {
    console.log("Running on server " + PORT);
});


