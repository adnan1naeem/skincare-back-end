const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const authRoutes = require('./routes/Auth');
const path = require('path');
const router = require("./src/routes");
require("dotenv").config();
const app = express();
app.use(require("morgan")("dev"));
var cors = require('cors')
// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.get("/api/test", (req, res) => {
  return res.status(200).send("Server Running");
});
app.set("view engine", "jade");
// Routes
app.use("/api", router);
// MongoDB Connection
mongoose
  .connect(`mongodb+srv://esthemate:esthemate@cluster0.klkp1sd.mongodb.net/esthemate`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
    

    const SkinAnalysisDescription = require("./src/models/SkinAnalysisDescription");
    const detailText="It is a long established fact that a reader will be distracted by the  readable content of a page when looking at its layout. The point of  using Lorem Ipsum is that it has a more-or-less normal distribution of  letters, as opposed to using 'Content here, content here', making it  look like readable English Many desktop publishing packages and web page editors now use Lorem  Ipsum as their default model text, and a search for 'lorem ipsum' will  uncover many web sites still in their infancy. Various versions have  evolved over the years, sometimes by accident, sometimes on purpose "
    const seedData = [
      {
        parameter: "oilness",
        level: "low",
        title: "Low Oilness",
        description: "Your skin has low oil levels.",
        detail:detailText,
      },
      {
        parameter: "oilness",
        level: "medium",
        title: "Medium Oilness",
        description: "Your skin has moderate oil levels.",
        detail:detailText
      },
      {
        parameter: "oilness",
        level: "high",
        title: "High Oilness",
        description: "Your skin has high oil levels.",
        detail:detailText,
      },
      {
        parameter: "hydration",
        level: "low",
        title: "Low Hydration",
        description: "Your skin is not well hydrated.",
        detail:detailText
      },
      {
        parameter: "hydration",
        level: "medium",
        title: "Medium Hydration",
        description: "Your skin is moderately hydrated.",
        detail:detailText,
      },
      {
        parameter: "hydration",
        level: "high",
        title: "High Hydration",
        description: "Your skin is well hydrated.",
        detail:detailText,
      },
      {
        parameter: "elasticity",
        level: "low",
        title: "Low Elasticity",
        description: "Your skin has low elasticity.",
        detail:detailText,
      },
      {
        parameter: "elasticity",
        level: "medium",
        title: "Medium Elasticity",
        description: "Your skin has moderate elasticity.",
        detail:detailText,
      },
      {
        parameter: "elasticity",
        level: "high",
        title: "High Elasticity",
        description: "Your skin has high elasticity.",
        detail:detailText,
      },
    ];
    (async () => {
      const seeder = async () => {
        try {
          seedData.forEach(async (item) => {
            const i = await SkinAnalysisDescription.create(item);
          });
          console.log("seeding Completed");
        } catch (error) {
          console.log(error);
        }
      };
      const count = await SkinAnalysisDescription.countDocuments({});
      if (count > 0) {
        await SkinAnalysisDescription.deleteMany({
          parameter: { $exists: true },
        });
        console.log("deleted previous");
        await seeder();
      } else {
        await seeder();
      }
    })();
  })
  .catch((err) => console.error(err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

module.exports = app;
