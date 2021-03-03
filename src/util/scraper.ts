import axios from 'axios';
import cheerio from 'cheerio';
import Subject from '../interfaces/Subject';


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

