import ClassTableRow from './ClassTableRow'
export default interface ClassTable {
    sectionTerm: string,
    sectionLetter: string,
    sectionDirector: string,
    rowInfo: Array<ClassTableRow>
}