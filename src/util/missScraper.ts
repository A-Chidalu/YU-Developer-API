import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import * as LinkUtil from './LinkUtils';
import * as fwCoursesData from '../../data/fwCoursesCopy.json';
import CourseFacultyOld from '../interfaces/CourseFacultyOld';
import CourseToCourseFacultyOld from '../interfaces/CourseToCourseFacultyOld';
import PageData from '../interfaces/PageData';

/**
 * In the case the db does not have the course inside it, we need to rescrape the york website and grab the page info
 * 
 * @param courseFaculty 
 * @returns {PageData} - A Obj Representing all the data on the page
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
        if($(ele).children().first().text().includes("EECS 2030")) {
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
        //For each of the three sections on each table
        $(ele).find('td > table > tbody > tr').each(function(i2, iele) {
            if(i2 === 0) { //First tr in the table tbody
                //Get the Term
                console.log(`Term: ${$(iele).find('td > span > span').text()}`);
                
                //Get the section 
                console.log(`Section: ${$(iele).find('td > span').text()}`);
                // console.log($(iele).find('td > span').text());

                console.log("======================================================");
            } else if(i2 === 1) { //Second tr in the table tbody
                //Get the Section Director
                console.log(`Section Director: ${$(iele).find('td').text()}`);

                // console.log($(iele).find('td').text());
                console.log("======================================================");

            } else { //Third tr
                //For each row of the third section of a table
                $(iele).find('td > table > tbody > tr').each(function(i3, iiele) {
                        if(i3 > 0) {
                            //Get lecture 
                            // console.log(`Type: ${$(iiele).find('td:nth-child(1)').text()}`);
                            console.log(`Type: ${$(iiele).children().first().text()}`);


                            console.log("======================================================");


                            //Get Day, Start Time, Duraction Location
                            $(iiele).find('td:nth-child(2) > table > tbody > tr').each(function(i4, iiiele) {
                                console.log(`Day: ${$(iiiele).find("td:nth-child(1)").text()}`);
                                console.log(`Start Time: ${$(iiiele).find("td:nth-child(2)").text()}`);
                                console.log(`Duation: ${$(iiiele).find("td:nth-child(3)").text()}`);
                                console.log(`Location: ${$(iiiele).find("td:nth-child(4)").text()}`);
                                console.log("======================================================");
                            });

                            

                            console.log(`Cat Num: ${$(iiele).find("td:nth-child(3)").text()}`);
                            
                            console.log("======================================================");

                            console.log(`Instructor: ${$(iiele).find("td:nth-child(4)").text()}`);

                            console.log("======================================================");

                            console.log(`Notes & Additional: ${$(iiele).find("td:nth-child(5)").text()}`);

                            console.log("======================================================");

                        }

                        // console.log($(iiele).find('td:nth-child(1)').text());

                })
            }
        })      
    })

    //console.log(result.courseName);
    //console.log(result.courseDescription);
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

