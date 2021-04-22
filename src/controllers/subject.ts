import { Request, Response, NextFunction } from "express";

import * as scraper from '../util/scraper';
import config from '../config/config';
import * as dataCleanser from '../util/dataCleanserOld';
import PageDataOld from "../interfaces/PageDataOld";
import CourseFaculty from "../interfaces/CourseFaculty";
import CourseFacultyOld from "../interfaces/CourseFacultyOld";
/**
 * Get All subjects that York is offering in FW2021
 * @route GET 
 */
export const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let URL:string = config.SUBJECTS_URL as string;
    //console.log(URL || "That didnt work lol");
    
    const result = await scraper.getSubjectData(URL);
    res.json({subjects: result});
}

export const getCourseData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //const result:PageData = await scraper.scrapeInduvidualPage();
    //dataCleanser.cleanInduvidualPageData(result);
    //res.json({data: result});
}

export const getCourseAndFacultyData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let result:Array<CourseFacultyOld> = await scraper.scrapeAllCoursesAndFaculty();
    result = dataCleanser.cleanFaculty(result);
    res.json({data: result});
}

export const writeStuffToDB = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    scraper.writeAllCoursesToDB().then(() => {
        res.send("Done!");
    }).catch(err => res.send(err));
}

