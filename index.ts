import express from 'express';
import * as subjectController from './src/controllers/subject';
import config from './src/config/config'
// rest of the code remains same
const app = express();
//Using a Typescript Assertion here
const PORT: number = parseInt(config.port as string, 10) || 8080;


app.get('/', subjectController.getSubjects);


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});