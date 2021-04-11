"use strict";
exports.__esModule = true;
exports.getFullSpecificCourseURL = exports.getRootYorkLink = void 0;
var getRootYorkLink = function (courseFaculy, studySession) {
    return "https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/wa/crsq1?faculty=" + courseFaculy.faculty + "&subject=" + courseFaculy.courseID + "&studysession=" + studySession;
};
exports.getRootYorkLink = getRootYorkLink;
var getFullSpecificCourseURL = function (localURL) {
    return "https://w2prod.sis.yorku.ca" + localURL;
};
exports.getFullSpecificCourseURL = getFullSpecificCourseURL;
