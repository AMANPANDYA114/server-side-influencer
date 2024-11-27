// const mongoose = require('mongoose');

// require('dotenv').config({ path: "./.env" });

// module.exports = () => {
//     console.log("database");
//     const connectionParams = {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         //strictQuery: false
//     }
//     var compassUrl = process.env.COMPASS_URL;
//     // const atlasUrl = process.env.ATLAS_URL;
//     // console.log(atlasUrl);
//     try {
//         mongoose.connect(process.env.ATLAS_URL, connectionParams).then(() =>
//             console.log("Connected to DB Sucessfully")
//         )
//     } catch (error) {
//         console.log(error);
//         console.log("Could not Connect..");
//     }
// };


const mongoose = require('mongoose');

module.exports = () => {
    console.log("Connecting to database...");

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    const mongoUrl = "mongodb+srv://amanp114:UUr2tBfuGeTjHJxC@cluster0.tjlmotu.mongodb.net/";

    try {
        mongoose.connect(mongoUrl, connectionParams)
            .then(() => console.log("Connected to DB Successfully"))
            .catch((error) => {
                console.log("Error while connecting to DB:", error);
            });
    } catch (error) {
        console.log("Could not Connect:", error);
    }
};
