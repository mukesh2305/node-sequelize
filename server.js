const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./app/model");

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
// console.log("Drop and re-sync db.");
// });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ message: "Welcome to order managment application." });
});
require("./app/routes/product.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/order.routes")(app);


const PORT = process.env.PORT || 7010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});