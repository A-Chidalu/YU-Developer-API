/**
 * export default interface PageData {
    courseName: string,
    courseDescription: string, 
    sections: Array<Section>
}
 */

import Section from "./Section";

 export default class PageData {
    courseName: string;
    courseDescription: string;
    section: Array<Section>
 }