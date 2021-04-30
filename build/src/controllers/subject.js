"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseData = exports.getSubjects = void 0;
const CourseGrabberUtil = __importStar(require("../util/missScraper"));
/**
 * Get All subjects that York is offering in FW2021
 * @route GET
 */
const getSubjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // let URL:string = config.SUBJECTS_URL as string;
    // //console.log(URL || "That didnt work lol");
    // const result = await scraper.getSubjectData(URL);
    res.json({ subjects: "result" });
});
exports.getSubjects = getSubjects;
const getCourseData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const faculty = req.query.faculty;
    const courseID = req.query.courseID;
    const data = yield CourseGrabberUtil.grabCourseData(courseID, faculty);
    if (!data) {
        res.json({ "error": "Please follow api instructions for how to search for a course." + `Course: ${courseID} with faculty ${faculty} is most likley not a valid course` });
    }
    else {
        res.json({ data });
    }
});
exports.getCourseData = getCourseData;
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
