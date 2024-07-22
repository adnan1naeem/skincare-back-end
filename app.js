const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const authRoutes = require('./routes/Auth');
const router = require('./src/routes')
require('dotenv').config();
const app = express();
app.use(require('morgan')('dev'))

// Middleware
app.use(bodyParser.json());
app.get('/api/test', (req, res) => {
  return res.status(200).send('Server Running')
})
app.set('view engine', 'jade');
// Routes
app.use('/api', router);
// app.use(router)
// MongoDB Connection
mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected')
    const SkinAnalysisDescription = require('./src/models/SkinAnalysisDescription');
    const seedData = [
      { parameter: 'oilness', level: 'low', title: 'Low Oilness', description: 'Your skin has low oil levels.' },
      { parameter: 'oilness', level: 'medium', title: 'Medium Oilness', description: 'Your skin has moderate oil levels.' },
      { parameter: 'oilness', level: 'high', title: 'High Oilness', description: 'Your skin has high oil levels.' },
      { parameter: 'hydration', level: 'low', title: 'Low Hydration', description: 'Your skin is not well hydrated.' },
      { parameter: 'hydration', level: 'medium', title: 'Medium Hydration', description: 'Your skin is moderately hydrated.' },
      { parameter: 'hydration', level: 'high', title: 'High Hydration', description: 'Your skin is well hydrated.' },
      { parameter: 'elasticity', level: 'low', title: 'Low Elasticity', description: 'Your skin has low elasticity.' },
      { parameter: 'elasticity', level: 'medium', title: 'Medium Elasticity', description: 'Your skin has moderate elasticity.' },
      { parameter: 'elasticity', level: 'high', title: 'High Elasticity', description: 'Your skin has high elasticity.' }
    ];
    (async () => {
      const seeder = (async () => {
        try {
          seedData.forEach(async item => {
            const i = await SkinAnalysisDescription.create(item)
          })
          console.log("seeding Completed")
        } catch (error) {
          console.log(error)
        }
      })
      const count = await SkinAnalysisDescription.countDocuments({})
      if (count > 0) {
        await SkinAnalysisDescription.deleteMany({
          parameter: { $exists: true }
        })
        console.log('deleted previous')
        await seeder()
      } else { await seeder() }
    })();
  })
  .catch(err => console.error(err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({ message: err.message });
});

module.exports = app;
