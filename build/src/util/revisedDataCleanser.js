"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanFaculty = exports.cleanInduvidualPageData = void 0;
const cleanInduvidualPageData = (data) => {
    //Clean course name
    let newCourseName = data.courseName;
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
};
exports.cleanInduvidualPageData = cleanInduvidualPageData;
const cleanTable = (table) => {
    //Clean section term
    table.sectionTerm = table.sectionTerm.trim();
    //Clean sectionLetter
    let idx = table.sectionLetter.indexOf('Section');
    table.sectionLetter = table.sectionLetter.slice(idx);
    let splitArr = table.sectionLetter.split(" "); //Ex: Split "Section A" -> ["Section", "A"]
    table.sectionLetter = splitArr[1];
    /**
     * Clean SectionDirector:
     *
     * Example: "<a href=\"/Apps/WebObjects/cdm.woa/wa/loginppy?url=/Apps/WebObjects/cdm.woa/6/wo/BLtcAeDzapFHHGyYtHitsM/2.3.10.8.3.0.0.5\">Please click here to see availability.<br></a>Section Director: Qian Sandy Qu&nbsp;&nbsp;&nbsp;"
     */
    if (table.sectionDirector.includes('Not Available')) {
        table.sectionDirector = 'Section Director: Not Available';
    }
    else {
        let lowerIdx = table.sectionDirector.indexOf('Section Director');
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
};
const cleanTableRow = (tableRow) => {
    var _a, _b, _c;
    //Clean ClassType
    tableRow.classType = (_a = tableRow.classType) === null || _a === void 0 ? void 0 : _a.trim().replace(/  /g, ' ');
    //clean classTimeInfo
    //tableRow.classTimeInfo.forEach(classTimeInfo => cleanClassTimeInfo(classTimeInfo));
    //Clean cat NUm
    if (tableRow.catNum.length < 6) {
        tableRow.catNum = "";
    }
    else {
        if (tableRow.catNum.length > 2) {
            tableRow.catNum = tableRow.catNum.slice(2);
        }
    }
    //Clean Instructor
    tableRow.instructor = tableRow.instructor.trim();
    //clean notesOrAdditionalFees
    tableRow.notesOrAdditionalFees = (_b = tableRow.notesOrAdditionalFees) === null || _b === void 0 ? void 0 : _b.trim().replace(/&nbsp;/g, '');
    tableRow.notesOrAdditionalFees = (_c = tableRow.notesOrAdditionalFees) === null || _c === void 0 ? void 0 : _c.replace(/[\r\n]/g, '');
};
const cleanClassTimeInfo = (classTimeInfo) => {
    //Do Nothing
    return;
};
const cleanFaculty = (courseFacultyArr) => {
    let result = [];
    courseFacultyArr.forEach(element => {
        const tempObj = {
            faculty: getFirstFaculty(element.faculty),
            courseID: element.courseID
        };
        result.push(tempObj);
    });
    return result;
    function getFirstFaculty(facultyString) {
        //let facultyString: string = facultyString
        facultyString = facultyString.replace(/(\(|\))/gmi, "");
        facultyString = facultyString.trim();
        console.log(facultyString);
        if (facultyString.length > 2) {
            let facultyArr = facultyString.split(",");
            return facultyArr[0];
        }
        else {
            return facultyString;
        }
    }
};
exports.cleanFaculty = cleanFaculty;
