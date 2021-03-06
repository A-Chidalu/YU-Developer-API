import Section from './Section';
export default interface PageData {
    courseName: string,
    courseDescription: string, 
    sections: Array<Section>
}