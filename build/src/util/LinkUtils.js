"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullSpecificCourseURL = exports.getRootYorkLink = void 0;
const getRootYorkLink = (courseFaculy, studySession) => {
    return `https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/wa/crsq1?faculty=${courseFaculy.faculty}&subject=${courseFaculy.courseID}&studysession=${studySession}`;
};
exports.getRootYorkLink = getRootYorkLink;
const getFullSpecificCourseURL = (localURL) => {
    return "https://w2prod.sis.yorku.ca" + localURL;
};
exports.getFullSpecificCourseURL = getFullSpecificCourseURL;
