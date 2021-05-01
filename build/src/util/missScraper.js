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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grabCourseData = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const LinkUtil = __importStar(require("./LinkUtils"));
const fwCoursesData = __importStar(require("../../data/fwCoursesCopy.json"));
const revisedDataCleaner = __importStar(require("./revisedDataCleanser"));
const CourseUtil = __importStar(require("./courseUtils"));
/**
 *
 * @param subject {String} subject ex: EECS, ARTH, HIST
 * @param faculty {String} faculty course is in ex: LE, AP, GS, etc
 * @returns {PageData} The Data Scrapped from that specific course
 */
const grabCourseData = (courseID, faculty) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(LinkUtil.getRootYorkLink(courseFaculty, "fw"));
    const subject = CourseUtil.getSubject(courseID);
    const fullCourse = CourseUtil.getFullCourse(courseID);
    const courseFaculty = { faculty, courseID: subject };
    let { data } = yield axios_1.default.get(LinkUtil.getRootYorkLink(courseFaculty, "fw"));
    let $ = cheerio_1.default.load(data);
    const tBodySelector = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody";
    let link = "";
    //SELECT ALL tr's that are DESCENDANTS of tBody
    $(tBodySelector + " > tr").each(function (i, ele) {
        if ($(ele).children().first().text().includes(`${fullCourse.subject} ${fullCourse.subjectNum}`)) {
            //console.log($(ele).find('td:nth-child(3)').html());
            //console.log($($(ele).find('td:nth-child(3)').html()).attr('href'));
            //Messy way of getting the href, might need to fix later
            link = $($(ele).find('td:nth-child(3)').html()).attr('href') || "";
        }
    });
    if (link) {
        link = LinkUtil.getFullSpecificCourseURL(link);
        console.log(link);
    }
    else {
        return null;
    }
    const specificCoursePage = yield axios_1.default.get(link);
    $ = cheerio_1.default.load(specificCoursePage.data);
    const courseNameSelector = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td:nth-child(1) > h1";
    const courseDescriptionSelector = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > p:nth-child(5)";
    const result = {
        courseName: "",
        courseDescription: "",
        pageTableData: []
    };
    result.courseName = $(courseNameSelector).text();
    result.courseDescription = $(courseDescriptionSelector).text();
    const mainTbodySelector = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(9) > tbody";
    if ($(mainTbodySelector).length <= 0) {
        return null;
    }
    //For each table on the page
    $(`${mainTbodySelector} > tr`).each(function (i1, ele) {
        const tempClassTable = {
            sectionTerm: "",
            sectionLetter: "",
            sectionDirector: "",
            rowInfo: []
        };
        //For each of the three sections on each table
        $(ele).find('td > table > tbody').eq(0).children().each(function (i2, iele) {
            if (i2 === 0) { //First tr in the table tbody
                //Get the Term
                const term = $(iele).find('td > span > span').text();
                tempClassTable.sectionTerm = term;
                // console.log(`Term: ${term}`);
                //Get the section 
                const section = $(iele).find('td > span').text();
                tempClassTable.sectionLetter = section;
                // console.log(`Section: ${section}`);
                // console.log($(iele).find('td > span').text());
                //console.log("======================================================");
            }
            else if (i2 === 1) { //Second tr in the table tbody
                //Get the Section Director
                const sectDirector = $(iele).find('td').text();
                tempClassTable.sectionDirector = sectDirector;
                // console.log(`Section Director: ${sectDirector}`);
                // console.log($(iele).find('td').text());
                //console.log("======================================================");
            }
            else { //Third tr
                //For each row of the third section of a table
                $(iele).find('td > table > tbody').eq(0).children().each(function (i3, iiele) {
                    const tempClassTableRow = {
                        classType: "",
                        classTimeInfo: [],
                        catNum: "",
                        instructor: "",
                        notesOrAdditionalFees: ""
                    };
                    if (i3 > 0) {
                        //Get lecture 
                        // console.log(`Type: ${$(iiele).find('td:nth-child(1)').text()}`);
                        const type = $(iiele).children().first().text();
                        tempClassTableRow.classType = type;
                        //console.log(`Type: ${type}`);
                        //console.log("======================================================");
                        //Get Day, Start Time, Duraction Location
                        $(iiele).find('td:nth-child(2) > table > tbody').eq(0).children().each(function (i4, iiiele) {
                            const tempClassTimeInfo = {
                                day: "",
                                startTime: "",
                                duration: "",
                                location: "",
                            };
                            const day = $(iiiele).find("td:nth-child(1)").text();
                            tempClassTimeInfo.day = day;
                            //console.log(`Day: ${day}`);
                            const classStartTime = $(iiiele).find("td:nth-child(2)").text();
                            tempClassTimeInfo.startTime = classStartTime;
                            //console.log(`Start Time: ${classStartTime}`);
                            const classDuration = $(iiiele).find("td:nth-child(3)").text();
                            tempClassTimeInfo.duration = classDuration;
                            //console.log(`Duation: ${classDuration}`);
                            const classLocation = $(iiiele).find("td:nth-child(4)").text();
                            tempClassTimeInfo.location = classLocation;
                            // console.log(`Location: ${classLocation}`);
                            //console.log("======================================================");
                            tempClassTableRow.classTimeInfo.push(tempClassTimeInfo);
                        });
                        const catnum = $(iiele).find("td:nth-child(3)").text();
                        tempClassTableRow.catNum = catnum;
                        //console.log(`Cat Num: ${catnum}`);
                        //console.log("======================================================");
                        const instructor = $(iiele).find("td:nth-child(4)").text();
                        tempClassTableRow.instructor = instructor;
                        //console.log(`Instructor: ${$(iiele).find("td:nth-child(4)").text()}`);
                        //console.log("======================================================");
                        const notesAndAddtional = $(iiele).find("td:nth-child(5)").text();
                        tempClassTableRow.notesOrAdditionalFees = notesAndAddtional;
                        //console.log(`Notes & Additional: ${$(iiele).find("td:nth-child(5)").text()}`);
                        //console.log("======================================================");
                        tempClassTable.rowInfo.push(tempClassTableRow);
                    }
                    // console.log($(iiele).find('td:nth-child(1)').text());
                });
            }
        });
        result.pageTableData.push(tempClassTable);
    });
    revisedDataCleaner.cleanInduvidualPageData(result);
    //console.dir(result, { depth: null });
    return result;
});
exports.grabCourseData = grabCourseData;
/**
 *
 * @param subject A subject to search for like EECS
 */
const getFaculty = (subject) => {
    let facultyLookupMap = {};
    fwCoursesData.data.forEach((obj) => {
        facultyLookupMap[obj.courseID] = obj;
    });
    //console.log(facultyLookupMap);
    return facultyLookupMap[subject];
};
