import axios from 'axios';
import cheerio from 'cheerio';
import Subject from '../interfaces/Subject';
import puppeteer, { Browser, Page } from 'puppeteer';
import config from '../config/config';
import Section from '../classes/Section';
import BroswerPage from '../interfaces/BrowserPage';



// const SUBJECTS_URL: string = process.env.SUBJECTS_URL || "https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/6/wo/4Z2NEPhlIWEVA3pxeFQ3Y0/0.3.10.21";

export const getSubjectData = async(SUBJECT_URL: string): Promise<Array<Subject>> => {
    try{
        //console.log("Im here!!!");
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
    //Table that contains all tables
    ///html/body/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/table[2]
    
    /**
     * Table that holdes all the tables:
     * /html/body/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/table[2]
     * 
     * Table body <tbody> that holds each table:
     * html/body/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/table[2]
     * 
     */
    
    
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

export const scrapeInduvidualPage = async (): Promise<void> => {
   const currBrowserPage: BroswerPage = await startBroswer("https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/3/wo/onRlAXIIxoKJy5ibZIeS9M/3.3.10.8.3.0.0.5");

   let currSection: Section = new Section();
   
   //Get <tbody> that contains all the tables
   const tBody = await currBrowserPage.page.$x("/html/body/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/table[2]/tbody");
   alert(tBody);
   currBrowserPage.broswer.close();

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

