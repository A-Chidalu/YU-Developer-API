import Course from "../interfaces/Course";

/**
 * 
 * @param courseID {String} takes in a courseID such as EECS2030
 * @returns {String} returns subject part of the courseID, ex: EECS
 */
export const getSubject = (courseID: string): string => {
    if(courseID.length === 0) {
        return "";
    }

    let sliceIndex: number = 0;

    for(let i = 0; i < courseID.length; i++) {
        if(courseID.charAt(i) >= '0' && courseID.charAt(i) <= '9') {
            sliceIndex = i;
            break;
        }
    }

    return courseID.substr(0, sliceIndex);
}

export const getFullCourse = (courseID: string): Course => {
    let subject: string = getSubject(courseID);
    let subjectNum: string = "";

    let sliceIndex: number = 0;

    for(let i = 0; i < courseID.length; i++) {
        if(courseID.charAt(i) >= '0' && courseID.charAt(i) <= '9') {
            sliceIndex = i;
            break;
        }
    }

    subjectNum = courseID.slice(sliceIndex);

    return {subject, subjectNum};
    
}



