const { PORT } = require('./config');
const express = require('express');
const app = express();
const { getDataFromAPI, postDataToDatabase } = require('./refs');

app.post('/refs', async (req, res) => {
  try {
    const references = await getDataFromAPI();
    const dbData = await postDataToDatabase(references);
    res.status(200).json('Successfully Posted to the database!')
  } catch(error) {
    console.log(error);
    res.status(500).json('Error encountered!')
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
