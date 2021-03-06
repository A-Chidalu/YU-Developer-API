import { Request, Response, NextFunction } from "express";

import * as scraper from '../util/scraper';
import config from '../config/config'
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
    const result = await scraper.scrapeInduvidualPage();
    res.json({data: result});
}