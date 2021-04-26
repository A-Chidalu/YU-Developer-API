import express from 'express';
import * as subjectController from './src/controllers/subject';
import config from './src/config/config'
// rest of the code remains same
const app = express();
//app.use(express.json());
//Using a Typescript Assertion here
const PORT: number = parseInt(config.port as string, 10) || 8080;


app.get('/', subjectController.getSubjects);

app.get('/course', subjectController.getCourseData);

// app.get('/courses/data', subjectController.getCourseData);

// app.get('/coursesAndFaculty', subjectController.getCourseAndFacultyData);

// app.get('/write', subjectController.writeStuffToDB);


app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});