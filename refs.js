const { DB_PASSWORD, USER, HOST, DATABASE } = require('./config');
const axios = require('axios');
const mysql = require('mysql2/promise');
const { refs } = require('./refs.schema');
const { REFERENCE } = require('./constant');

module.exports.getDataFromAPI = async () => {
  try {
    const { data } = await axios.get(REFERENCE);
    const references = [];
    for(const [key, value] of Object.entries(data.content && data.content.references)) {
      const authors = value.authors.map(author => {
        return author.name;
      });
      const obj = {
        articleId: value.id,
        title: value.headline.default,
        free: !(value.accessType === 'premium'),
        standfirst: value.standfirst.default,
        dateLive: value.date.live,
        dateUpdated: value.date.updated,
        originalSource: value.rightsMetadata.originatedSource,
        authors: authors.join(', '),
        section: value.target.sections[0].id,
        inDt: value.target.domains.includes('dailytelegraph.com.au')
      }
      references.push(obj);
    } 
    return references;
  } catch (error) {
      throw error;
  }
}

module.exports.postDataToDatabase = async (references) => {
  try {
    const connection = await mysql.createConnection({host: HOST, user: USER, database: DATABASE, password: DB_PASSWORD});
    return await Promise.all(references.map(async (item) => {
      const fields = [];
      const questionMarks = [];
      for (const property in item) {
        fields.push(item[property]);
        questionMarks.push('?');
      }
      return await connection.execute(`INSERT into refs (${refs.join(',')}) VALUES (${questionMarks.join(',')})`, fields);
    }));
  } catch(error) {
    throw error;
  }
}
