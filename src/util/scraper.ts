import axios from 'axios';
import cheerio from 'cheerio';
import Subject from '../interfaces/Subject';
import puppeteer, { Browser, Page } from 'puppeteer';
import BroswerPage from '../interfaces/BrowserPage';
import PageData from '../interfaces/PageData';
import ClassTableRow from '../interfaces/ClassTableRow';
import ClassTable from '../interfaces/ClassTable';




// const SUBJECTS_URL: string = process.env.SUBJECTS_URL || "https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/6/wo/4Z2NEPhlIWEVA3pxeFQ3Y0/0.3.10.21";

export const getSubjectData = async(SUBJECT_URL: string): Promise<Array<Subject>> => {
    try{
        const response = await axios.get(SUBJECT_URL);
        const html = response.data;
        const $ = cheerio.load(html);
        const subjectSelect = $('#subjectSelect > option');
        let subjectArr: Subject[] = [];
    
        subjectSelect.each((idx, elem) => {
            const currSubject:string = $(elem).text();
            //console.log(parseSubject(currSubject));
            
            subjectArr.push(parseSubject(currSubject));
        });
    
        
        return subjectArr;
    }
    catch(err) {
        return err;
    }
}

const parseSubject = (currSubject: string): Subject => {
    let currSubjectArr: Array<string> = currSubject.split('-');
    currSubjectArr = currSubjectArr.map((ele) => ele.trim());

    let resultSubject: Subject = {
        abbrev: currSubjectArr[0],
        subjectName: currSubjectArr[1],
        faculty: getFacultyArrFromString(currSubjectArr[2])
    }


    return resultSubject;
}

/**
 * 
 * @param facultyString  - A String that looks like "( SB, AP, ED )"
 * @returns an Array that looks like ["SB", "AP", "ED"]
 */
const getFacultyArrFromString = (facultyString: string): Array<string> => {
    facultyString = facultyString.replace("(", "");
    facultyString = facultyString.replace(")", "");
    facultyString = facultyString.trim();
    let facultyArr = facultyString.split(",");
    facultyArr = facultyArr.map((ele) => ele.trim());

    return facultyArr;
}

export const getCourseData = async (): Promise<void> => {
    const browser: Browser = await puppeteer.launch({
        headless: false,
        slowMo: 300, // slow down by 250ms
    });
    
    const page:Page = await browser.newPage();
    await page.goto("https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/9/wo/yFQKbwyb7Ly90cOsTqVwjw/2.3.10.7");
    
    
    //1.Loop over and click each one of the courses
    await page.$eval('#subjectSelect', (subjectSelectBox) => {            
        Array.from(subjectSelectBox.children).forEach((child) => {
            const SUBMIT_BTTN_NAME: string = "3.10.7.5";
            child.setAttribute("selected", "true");
            const submitBttn = document.getElementsByName(SUBMIT_BTTN_NAME)[0];
            submitBttn.click();
        })
    })
    

    
    browser.close();
};

export const scrapeInduvidualPage = async (): Promise<Object> => {
    
    const currBrowserPage: BroswerPage = await startBroswer("https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/6/wo/BLtcAeDzapFHHGyYtHitsM/2.3.10.8.3.0.0.5");
    try{
        //Get course name
        const [courseNameElement] = await currBrowserPage.page.$x("/html/body/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/table[1]/tbody/tr/td[1]/h1");
        const courseName: string = await currBrowserPage.page.evaluate(parseSingleHTMLItem, courseNameElement); 
        
        //Get course description
        const [courseDescriptionElement] = await currBrowserPage.page.$x("/html/body/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/p[3]");
        const courseDescription: string = await currBrowserPage.page.evaluate(parseSingleHTMLItem, courseDescriptionElement); 

        //Get <tbody> that contains all the tables
        const [tBody] = await currBrowserPage.page.$x("/html/body/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/table[2]/tbody");
        const pageTableData = await currBrowserPage.page.evaluate(parseTableInfo, tBody);
        const result:PageData = {
            courseName,
            courseDescription,
            pageTableData
        }
        currBrowserPage.broswer.close();

        return result;
   }catch(err){
        currBrowserPage.broswer.close();
        console.log(err);
       return err;
   }

}

const startBroswer = async (URL: string): Promise<BroswerPage> => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 300, // slow down by 250ms
    });
    
    const page = await browser.newPage();
    await page.goto(URL);
    
    return {
        broswer: browser,
        page: page
    };
}

const parseTableInfo = (tBody:Element): Promise<Array<ClassTable>> => {
    const pageTableData:Array<ClassTable> = [];
    try {
        Array.from(tBody.children).forEach((childRow:Element) => {
            let tableData: ClassTable = {
                sectionTerm: "",
                sectionLetter: "",
                sectionDirector: "",
                rowInfo: [] as any
            }
            const sectionTermEle:Element|null = childRow.querySelector('td > table > tbody > tr > td > span > span');
            const sectionLetterEle:Element|null = childRow.querySelector('td > table > tbody > tr > td > span');
            const sectionDirectorEle:Element|null = childRow.querySelector('td > table > tbody > tr:nth-child(2) > td');
            const mainTableElement:Element|null = childRow.querySelector('td > table > tbody > tr:nth-child(3) > td > table > tbody');

            tableData.sectionTerm = sectionTermEle?.innerHTML as string;
            tableData.sectionLetter = sectionLetterEle?.innerHTML as string;
            tableData.sectionDirector = sectionDirectorEle?.innerHTML as string;

            for(let i = 1; i < mainTableElement!.children.length; i++) {
                let tableRowObj: ClassTableRow = {
                    classType: "",
                    day: "",
                    startTime:"",
                    duration: "",
                    location: "",
                    catNum: "",
                    instructor: "",
                    notesOrAdditionalFees: ""
                };
                const currChildTableRow: Element = mainTableElement!.children[i];

                const classTypeEle: Element|null = currChildTableRow.querySelector('td');
                const dayOfTheWeekEle: Element|null = currChildTableRow.querySelector('td:nth-child(2) > table > tbody > tr > td:nth-child(1)');
                const startTimeEle: Element | null = currChildTableRow.querySelector('td:nth-child(2) > table > tbody > tr > td:nth-child(2)');
                const durationEle: Element | null = currChildTableRow.querySelector('td:nth-child(2) > table > tbody > tr > td:nth-child(3)');
                const locationEle: Element | null = currChildTableRow.querySelector('td:nth-child(2) > table > tbody > tr > td:nth-child(4)');
                const catNumEle: Element | null = currChildTableRow.querySelectorAll('td:nth-child(3)')[1];
                const instructorEle: Element | null = currChildTableRow.querySelector('td:nth-child(4) > a');
                const notesOrAdditionalFeesEle: Element | null = currChildTableRow.querySelector('td:nth-child(5)');
                tableRowObj.classType = classTypeEle?.innerHTML as string;
                tableRowObj.day = dayOfTheWeekEle?.innerHTML as string;
                tableRowObj.startTime = startTimeEle?.innerHTML as string;
                tableRowObj.duration = durationEle?.innerHTML as string;
                tableRowObj.location = locationEle?.innerHTML as string;
                tableRowObj.catNum = catNumEle?.innerHTML as string;
                tableRowObj.instructor = instructorEle?.innerHTML as string;
                tableRowObj.notesOrAdditionalFees = notesOrAdditionalFeesEle?.innerHTML as string;
        
                tableData.rowInfo.push(tableRowObj);
            }
            pageTableData.push(tableData);
        });
    }
    catch(err) {
        alert(err);
    }
    return new Promise((resolve) => {
        resolve(pageTableData);
    });
}


const parseSingleHTMLItem = (singleHTMLItem: Element): Promise<string> => {
    const singleHTMLItemText: string = singleHTMLItem.innerHTML as string;
    return new Promise((resolve) => {
        resolve(singleHTMLItemText);
    });
}

// const parseMainTableInfo = (mainTable: Element): void => {
    
    
//     try {
//         const tableData = [];
//         for(let i = 1; i < mainTable.children.length; i++) {
//             let temp = {
//                 classType: "",
//                 day: "",
//                 startTime:"",
//                 duration: "",
//                 location: "",
//                 catNum: "",
//                 instructor: "",
//                 notesOrAdditionalFees: ""
//             };
//             const currChild: Element = mainTable.children[i];
//             const classTypeEle: Element|null = currChild.querySelector('td');
//             const dayOfTheWeekEle: Element|null = currChild.querySelector('td:nth-child(2) > table > tbody > tr > td:nth-child(1)');
//             const startTimeEle: Element | null = currChild.querySelector('td:nth-child(2) > table > tbody > tr > td:nth-child(2)');
//             const durationEle: Element | null = currChild.querySelector('td:nth-child(2) > table > tbody > tr > td:nth-child(3)');
//             const locationEle: Element | null = currChild.querySelector('td:nth-child(2) > table > tbody > tr > td:nth-child(4)');
//             const catNumEle: Element | null = currChild.querySelector('td:nth-child(3)');
//             const instructorEle: Element | null = currChild.querySelector('td:nth-child(4) > a');
//             const notesOrAdditionalFeesEle: Element | null = currChild.querySelector('td:nth-child(5)');
//             temp.classType = classTypeEle?.innerHTML as string;
//             temp.day = dayOfTheWeekEle?.innerHTML as string;
//             temp.startTime = startTimeEle?.innerHTML as string;
//             temp.duration = durationEle?.innerHTML as string;
//             temp.location = locationEle?.innerHTML as string;
//             temp.catNum = catNumEle?.innerHTML as string;
//             temp.instructor = instructorEle?.innerHTML as string;
//             temp.notesOrAdditionalFees = notesOrAdditionalFeesEle?.innerHTML as string;
    
//             tableData.push(temp);
//             alert(temp);
//         }

//     } catch(err){
//         console.log(err);
//     }
// }

