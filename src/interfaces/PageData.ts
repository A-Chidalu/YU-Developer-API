import ClassTable from "./ClassTable";

export default interface PageData {
    courseName: string,
    courseDescription: string, 
    pageTableData: Array<ClassTable>
}