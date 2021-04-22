import ClassTimeInfo from "./ClassTimeInfo";

export default interface ClassTableRow {
    classType: string,
    classTimeInfo: Array<ClassTimeInfo>,
    catNum: string,
    instructor: string,
    notesOrAdditionalFees: string
}