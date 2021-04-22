import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import * as LinkUtil from './LinkUtils';
import * as fwCoursesData from '../../data/fwCoursesCopy.json';
import CourseFacultyOld from '../interfaces/CourseFacultyOld';
import CourseToCourseFacultyOld from '../interfaces/CourseToCourseFacultyOld';
import PageData from '../interfaces/PageData';
import ClassTable from '../interfaces/ClassTable';
import ClassTableRow from '../interfaces/ClassTableRow';
import ClassTimeInfo from '../interfaces/ClassTimeInfo';
import * as revisedDataCleaner from './revisedDataCleanser';

/**
 * In the case the db does not have the course inside it, we need to rescrape the york website and grab the page info
 * 
 * @param courseFaculty 
 * @returns {PageDataOld} - A Obj Representing all the data on the page
 */
const grabMissedCourse = async (courseFaculty: CourseFacultyOld): Promise<void> => {
    //console.log(LinkUtil.getRootYorkLink(courseFaculty, "fw"));
    let { data }: AxiosResponse<any> = await axios.get(LinkUtil.getRootYorkLink(courseFaculty, "fw"));
    let $: cheerio.Root = cheerio.load(data);
    const tBodySelector: string = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody";
    const courseNum: string = "2030";
    let link: string = "";

    //SELECT ALL tr's that are DESCENDANTS of tBody
    $(tBodySelector + " > tr").each(function (i, ele) {
        if ($(ele).children().first().text().includes("EECS 2030")) {
            //console.log($(ele).find('td:nth-child(3)').html());
            //console.log($($(ele).find('td:nth-child(3)').html()).attr('href'));
            //Messy way of getting the href, might need to fix later
            link = $($(ele).find('td:nth-child(3)').html()).attr('href') || "";
        }
    })


    if (link) {
        link = LinkUtil.getFullSpecificCourseURL(link);
        console.log(link);
    }
    else {
        return;
    }

    const specificCoursePage: AxiosResponse<any> = await axios.get(link);
    $ = cheerio.load(specificCoursePage.data);

    const courseNameSelector: string = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td:nth-child(1) > h1";
    const courseDescriptionSelector: string = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > p:nth-child(5)";

    const result: PageData = {
        courseName: "",
        courseDescription: "",
        pageTableData: []
    };

    result.courseName = $(courseNameSelector).text();
    result.courseDescription = $(courseDescriptionSelector).text();

    const mainTbodySelector: string = "body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(9) > tbody";

    //For each table on the page
    $(`${mainTbodySelector} > tr`).each(function (i1, ele) {
        const tempClassTable: ClassTable = {
            sectionTerm: "",
            sectionLetter: "",
            sectionDirector: "",
            rowInfo: []
        }
        //For each of the three sections on each table
        $(ele).find('td > table > tbody').eq(0).children().each(function (i2, iele) {
            if (i2 === 0) { //First tr in the table tbody
                //Get the Term
                const term: string = $(iele).find('td > span > span').text();
                tempClassTable.sectionTerm = term;
                // console.log(`Term: ${term}`);


                //Get the section 
                const section: string = $(iele).find('td > span').text();
                tempClassTable.sectionLetter = section;
                // console.log(`Section: ${section}`);
                // console.log($(iele).find('td > span').text());

                //console.log("======================================================");
            } else if (i2 === 1) { //Second tr in the table tbody
                //Get the Section Director
                const sectDirector: string = $(iele).find('td').text();
                tempClassTable.sectionDirector = sectDirector;
                // console.log(`Section Director: ${sectDirector}`);

                // console.log($(iele).find('td').text());
                //console.log("======================================================");

            } else { //Third tr
                //For each row of the third section of a table
                $(iele).find('td > table > tbody').eq(0).children().each(function (i3, iiele) {
                    const tempClassTableRow: ClassTableRow = {
                        classType: "",
                        classTimeInfo: [],
                        catNum: "",
                        instructor: "",
                        notesOrAdditionalFees: ""
                    }
                    if (i3 > 0) {
                        //Get lecture 
                        // console.log(`Type: ${$(iiele).find('td:nth-child(1)').text()}`);
                        const type: string = $(iiele).children().first().text();
                        tempClassTableRow.classType = type;
                        //console.log(`Type: ${type}`);


                        //console.log("======================================================");


                        //Get Day, Start Time, Duraction Location
                        $(iiele).find('td:nth-child(2) > table > tbody').eq(0).children().each(function (i4, iiiele) {
                            const tempClassTimeInfo: ClassTimeInfo = {
                                day: "",
                                startTime: "",
                                duration: "",
                                location: "",
                            }

                            const day: string = $(iiiele).find("td:nth-child(1)").text();
                            tempClassTimeInfo.day = day;
                            //console.log(`Day: ${day}`);

                            const classStartTime: string = $(iiiele).find("td:nth-child(2)").text();
                            tempClassTimeInfo.startTime = classStartTime;
                            //console.log(`Start Time: ${classStartTime}`);

                            const classDuration: string = $(iiiele).find("td:nth-child(3)").text();
                            tempClassTimeInfo.duration = classDuration;
                            //console.log(`Duation: ${classDuration}`);

                            const classLocation: string = $(iiiele).find("td:nth-child(4)").text();
                            tempClassTimeInfo.location = classLocation;
                            // console.log(`Location: ${classLocation}`);
                            //console.log("======================================================");

                            tempClassTableRow.classTimeInfo.push(tempClassTimeInfo);
                        });


                        const catnum: string = $(iiele).find("td:nth-child(3)").text();
                        tempClassTableRow.catNum = catnum;
                        //console.log(`Cat Num: ${catnum}`);

                        //console.log("======================================================");

                        const instructor: string = $(iiele).find("td:nth-child(4)").text();
                        tempClassTableRow.instructor = instructor;
                        //console.log(`Instructor: ${$(iiele).find("td:nth-child(4)").text()}`);

                        //console.log("======================================================");

                        const notesAndAddtional: string = $(iiele).find("td:nth-child(5)").text();
                        tempClassTableRow.notesOrAdditionalFees = notesAndAddtional;
                        //console.log(`Notes & Additional: ${$(iiele).find("td:nth-child(5)").text()}`);

                        //console.log("======================================================");

                        tempClassTable.rowInfo.push(tempClassTableRow);
                    }

                    // console.log($(iiele).find('td:nth-child(1)').text());

                })
            }

        })

        result.pageTableData.push(tempClassTable);
    })

    revisedDataCleaner.cleanInduvidualPageData(result);
    console.dir(result, { depth: null });
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

