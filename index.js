const { PORT, DB_PASSWORD } = require('./config');
const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');
const app = express();
const { refs } = require('./refs.schema');

app.get('/refs', async (req, res) => {
  try {
    const {data} = await axios.get('https://resourcesssl.newscdn.com.au/cs/dna_apps/testing/testData.json');
    const newArr = [];
    for(const [key, value] of Object.entries(data.content.references)) {
      const obj = {
        articleId: value.id,
        title: value.headline.default,
        free: !(value.accessType === 'premium'),
        standfirst: value.standfirst.default,
        dateLive: value.date.live,
        dateUpdated: value.date.updated,
        originalSource: value.rightsMetadata.originatedSource,
        authors: value.authors[0].name,
        section: value.target.sections[0].id
      }
      newArr.push(obj);
    }

    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'news', password: DB_PASSWORD});
    const dbData = await Promise.all(newArr.map(async (item) => {
      const fields = [];
      const questionMarks = [];
      for (const property in item) {
        fields.push(item[property]);
        questionMarks.push('?');
      }
      return await connection.execute(`INSERT into refs (${refs.join(',')}) VALUES (${questionMarks.join(',')})`, fields);
    }))
    console.log(dbData);
  } catch(error) {
    console.log(error);
  }
  res.status(200).json('Successfully Posted to the database!')
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});