import CourseFaculty from "../interfaces/CourseFaculty"
import CourseFacultyOld from "../interfaces/CourseFacultyOld";

export const getRootYorkLink = (courseFaculy: CourseFacultyOld, studySession: string): string => {
    return `https://w2prod.sis.yorku.ca/Apps/WebObjects/cdm.woa/wa/crsq1?faculty=${courseFaculy.faculty}&subject=${courseFaculy.courseID}&studysession=${studySession}`
}

export const getFullSpecificCourseURL = (localURL: string): string => {
    return "https://w2prod.sis.yorku.ca" + localURL;
}