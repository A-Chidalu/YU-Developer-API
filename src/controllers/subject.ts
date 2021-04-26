import { Request, Response, NextFunction } from "express";

//import * as scraper from '../util/scraper';
import config from '../config/config';
import * as dataCleanser from '../util/dataCleanserOld';
import CourseFacultyOld from "../interfaces/CourseFacultyOld";
import * as CourseGrabberUtil from "../util/missScraper";
import * as CourseUtil from "../util/courseUtils";
import PageData from "../interfaces/PageData";
/**
 * Get All subjects that York is offering in FW2021
 * @route GET 
 */
export const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // let URL:string = config.SUBJECTS_URL as string;
    // //console.log(URL || "That didnt work lol");
    
    // const result = await scraper.getSubjectData(URL);
    res.json({subjects: "result"});
}

export const getCourseData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const faculty: any = req.query.faculty;
    const courseID: any = req.query.courseID;


    const data: PageData | null = await CourseGrabberUtil.grabCourseData(courseID, faculty);

    if(!data) {
        res.json({"error": "Please follow api instructions for how to search for a course." + ` ${courseID} with faculty ${faculty} is most likley not a valid course`})
    }
    else {
        res.json({data});
    }
    

}

// export const getCourseAndFacultyData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     let result:Array<CourseFacultyOld> = await scraper.scrapeAllCoursesAndFaculty();
//     result = dataCleanser.cleanFaculty(result);
//     res.json({data: result});
// }

// export const writeStuffToDB = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     scraper.writeAllCoursesToDB().then(() => {
//         res.send("Done!");
//     }).catch(err => res.send(err));
// }

