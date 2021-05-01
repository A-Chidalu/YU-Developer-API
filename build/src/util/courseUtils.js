"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullCourse = exports.getSubject = void 0;
/**
 *
 * @param courseID {String} takes in a courseID such as EECS2030
 * @returns {String} returns subject part of the courseID, ex: EECS
 */
const getSubject = (courseID) => {
    if (courseID.length === 0) {
        return "";
    }
    let sliceIndex = 0;
    for (let i = 0; i < courseID.length; i++) {
        if (courseID.charAt(i) >= '0' && courseID.charAt(i) <= '9') {
            sliceIndex = i;
            break;
        }
    }
    return courseID.substr(0, sliceIndex);
};
exports.getSubject = getSubject;
const getFullCourse = (courseID) => {
    let subject = exports.getSubject(courseID);
    let subjectNum = "";
    let sliceIndex = 0;
    for (let i = 0; i < courseID.length; i++) {
        if (courseID.charAt(i) >= '0' && courseID.charAt(i) <= '9') {
            sliceIndex = i;
            break;
        }
    }
    subjectNum = courseID.slice(sliceIndex);
    return { subject, subjectNum };
};
exports.getFullCourse = getFullCourse;
