/**
 * export default interface PageData {
    courseName: string,
    courseDescription: string, 
    sections: Array<Section>
}
 */

import Section from "./Section";

 export default class PageData {
    private _courseName: string;
    private _courseDescription: string;
    private _sections: Array<Section>

    constructor(courseName: string, des: string) {
        this._courseName = courseName;
        this._courseDescription = des;
        this._sections = [];
    }

    set courseName(courseName: string) {
        this._courseName = courseName;
    }

    set courseDescription(courseDescription: string) {
        this._courseDescription = courseDescription;
    }

    addSection(currSection: Section) {
        this._sections.push(currSection);
    }


 }