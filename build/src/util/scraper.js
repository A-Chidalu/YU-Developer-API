"use strict";
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
exports.getSubjectData = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
// const SUBJECTS_URL: string = process.env.SUBJECTS_URL || "https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/6/wo/4Z2NEPhlIWEVA3pxeFQ3Y0/0.3.10.21";
const getSubjectData = (SUBJECT_URL) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(SUBJECT_URL);
    const html = response.data;
    const $ = cheerio_1.default.load(html);
    const subjectSelect = $('#subjectSelect > option');
    const subjectArr = [];
    subjectSelect.each((idx, elem) => {
        const currSubject = $(elem).text();
        //console.log(currSubject);
        subjectArr.push(parseSubject(currSubject));
    });
    return subjectArr;
});
exports.getSubjectData = getSubjectData;
const parseSubject = (currSubject) => {
    let currSubjectArr = currSubject.split('-');
    currSubjectArr = currSubjectArr.map((ele) => ele.trim());
    let resultSubject = {
        abbrev: currSubjectArr[0],
        subjectName: currSubjectArr[1],
        faculty: getFacultyArrFromString(currSubjectArr[3])
    };
    return resultSubject;
};
/**
 *
 * @param facultyString  - A String that looks like "( SB, AP, ED )"
 * @returns an Array that looks like ["SB", "AP", "ED"]
 */
const getFacultyArrFromString = (facultyString) => {
    facultyString = facultyString.replace("(", "");
    facultyString = facultyString.replace(")", "");
    facultyString = facultyString.trim();
    let facultyArr = facultyString.split(",");
    facultyArr = facultyArr.map((ele) => ele.trim());
    return facultyArr;
};
// // Send an async HTTP Get request to the url
// AxiosInstance.get(url)
//   .then( // Once we have data returned ...
//     response => {
//       const html = response.data; // Get the HTML from the HTTP request
//       const $ = cheerio.load(html); // Load the HTML string into cheerio
//       const statsTable: Cheerio = $('.statsTableContainer > tr'); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside
//       const topScorers: PlayerData[] = [];
//       statsTable.each((i, elem) => {
//         const rank: number = parseInt($(elem).find('.rank > strong').text()); // Parse the rank
//         const name: string = $(elem).find('.playerName > strong').text(); // Parse the name
//         const nationality: string = $(elem).find('.playerCountry').text(); // Parse the country
//         const goals: number = parseInt($(elem).find('.mainStat').text()); // Parse the number of goals
//         topScorers.push({
//           rank,
//           name,
//           nationality,
//           goals
//         })
//       })
//       console.log(topScorers);
//     }
//   )
//   .catch(console.error); // Error handling
