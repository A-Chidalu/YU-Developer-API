import ClassTable from "../interfaces/ClassTable";
import ClassTableRow from "../interfaces/ClassTableRow";
import ClassTimeInfo from "../interfaces/ClassTimeInfo";
import CourseFacultyOld from "../interfaces/CourseFacultyOld";
import PageData from "../interfaces/PageData";

export const cleanInduvidualPageData = (data: PageData): void => {
    //Clean course name
    let newCourseName:string = data.courseName;
    //newCourseName = newCourseName.replace(/&nbsp;/g, "");
    newCourseName = newCourseName.trim();
    newCourseName = newCourseName.replace(/   /g, " ");
    data.courseName = newCourseName;

    //Clean courseDescription
    let newCourseDescription = data.courseDescription;
    newCourseDescription = newCourseDescription.replace(/[\r\n]/g, '');
    data.courseDescription = newCourseDescription;

    //Clean tables in page
    data.pageTableData.forEach(table => cleanTable(table));

}

const cleanTable = (table: ClassTable): void => {

    //Clean section term
    table.sectionTerm = table.sectionTerm.trim();

    //Clean sectionLetter
    let idx:number = table.sectionLetter.indexOf('Section');
    table.sectionLetter = table.sectionLetter.slice(idx);
    let splitArr: Array<string> = table.sectionLetter.split(" "); //Ex: Split "Section A" -> ["Section", "A"]
    table.sectionLetter = splitArr[1];

    /**
     * Clean SectionDirector:
     * 
     * Example: "<a href=\"/Apps/WebObjects/cdm.woa/wa/loginppy?url=/Apps/WebObjects/cdm.woa/6/wo/BLtcAeDzapFHHGyYtHitsM/2.3.10.8.3.0.0.5\">Please click here to see availability.<br></a>Section Director: Qian Sandy Qu&nbsp;&nbsp;&nbsp;"
     */
    if(table.sectionDirector.includes('Not Available')) {
        table.sectionDirector = 'Section Director: Not Available';
    }
    else{
        let lowerIdx:number = table.sectionDirector.indexOf('Section Director');
        table.sectionDirector = table.sectionDirector.slice(lowerIdx);
        // let upperIdx:number = table.sectionDirector.indexOf('&nbsp;');
        // if(upperIdx > 0) {
        //     table.sectionDirector = table.sectionDirector.substr(0, upperIdx);
        //     splitArr = table.sectionDirector.split(": ");
        //     table.sectionDirector = splitArr[1];
        // }
        table.sectionDirector = table.sectionDirector.trim();
    }



    //Clean All the rows in the table
    table.rowInfo.forEach(tableRow => cleanTableRow(tableRow));


}

const cleanTableRow = (tableRow: ClassTableRow): void => {

    //Clean ClassType
    tableRow.classType = tableRow.classType?.trim().replace(/  /g, ' ');

    //clean classTimeInfo
    //tableRow.classTimeInfo.forEach(classTimeInfo => cleanClassTimeInfo(classTimeInfo));

    //Clean cat NUm
    if(tableRow.catNum.length < 6) {
        tableRow.catNum = "";
    }
    else {
        if(tableRow.catNum.length > 2) {
            tableRow.catNum = tableRow.catNum.slice(2);
        }
    }

    //Clean Instructor
    tableRow.instructor = tableRow.instructor.trim();

    //clean notesOrAdditionalFees
    tableRow.notesOrAdditionalFees = tableRow.notesOrAdditionalFees?.trim().replace(/&nbsp;/g, '');
    tableRow.notesOrAdditionalFees = tableRow.notesOrAdditionalFees?.replace(/[\r\n]/g, '');

}

const cleanClassTimeInfo = (classTimeInfo: ClassTimeInfo): void => {
    //Do Nothing
    return;
}

export const cleanFaculty = (courseFacultyArr: Array<CourseFacultyOld>): Array<CourseFacultyOld> => {

    let result: Array<CourseFacultyOld> = [];

    courseFacultyArr.forEach(element => {
        const tempObj:CourseFacultyOld = {
            faculty: getFirstFaculty(element.faculty),
            courseID: element.courseID
        }
        result.push(tempObj); 
    })

    return result;

    function getFirstFaculty(facultyString: string): string {
        //let facultyString: string = facultyString
        facultyString = facultyString.replace(/(\(|\))/gmi, "");
        facultyString = facultyString.trim();
        console.log(facultyString);
        if(facultyString.length > 2) {
            let facultyArr = facultyString.split(",");
            return facultyArr[0];
        }
        else {
            return facultyString;
        }

    }
}