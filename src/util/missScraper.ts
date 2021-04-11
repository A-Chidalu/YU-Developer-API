import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import * as LinkUtil from './LinkUtils';
import * as fwCoursesData from '../../data/fwCoursesCopy.json';
import CourseFacultyOld from '../interfaces/CourseFacultyOld';
import CourseToCourseFacultyOld from '../interfaces/CourseToCourseFacultyOld';


const grabMissedCourse = async (courseFaculty: CourseFacultyOld): Promise<void> => {
   let {data}: AxiosResponse<any> = await axios.get(LinkUtil.getRootYorkLink(courseFaculty, "fw"));
   let $: cheerio.Root = cheerio.load(data);
   const tBodySelector: string = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody";
   const courseNum: string = "2030";
   let link: string = "";
   $(tBodySelector).each((idx:number, ele:cheerio.Element) => { 
       if($(ele).find('td').text().includes("EECS 2030")) {
        link = $(ele).find('td:nth-child(3) > a').attr('href') || "";
       }
   })

   if(link) {
       link = LinkUtil.getFullSpecificCourseURL(link);
   }

   const specificCoursePage: AxiosResponse<any> = await axios.get(link);
   $ = cheerio.load(specificCoursePage.data);




   console.log(link);
    return;
}

/**
 * 
 * @param subject A subject to search for like EECS
 */
const getFaculty = (subject: string): CourseFacultyOld => {
    let facultyLookupMap: CourseToCourseFacultyOld = {};

    fwCoursesData.data.forEach((obj: CourseFacultyOld) => {
        facultyLookupMap[obj.courseID] = obj;
    })

    //console.log(facultyLookupMap);

    return facultyLookupMap[subject];
}



grabMissedCourse({ faculty: 'LE', courseID: 'EECS' });

