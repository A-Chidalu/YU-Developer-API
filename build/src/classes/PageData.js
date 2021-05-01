"use strict";
/**
 * export default interface PageData {
    courseName: string,
    courseDescription: string,
    sections: Array<Section>
}
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PageData {
    constructor(courseName, des) {
        this._courseName = courseName;
        this._courseDescription = des;
        this._sections = [];
    }
    set courseName(courseName) {
        this._courseName = courseName;
    }
    set courseDescription(courseDescription) {
        this._courseDescription = courseDescription;
    }
    addSection(currSection) {
        this._sections.push(currSection);
    }
}
exports.default = PageData;
