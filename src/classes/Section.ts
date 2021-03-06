
import { Day } from "../enums/Day";

 export default class Section {
    term: string;
    sectionLetter: string;
    sectionDirector: string;
    classType: string;
    day: Day;
    startTime: string;
    location: string;
    duration: number;
    catNum: string;
    instructor: string;
    additionalNotes: string;

    constructor() {
        this.term = "";
        this.sectionDirector = "";
        this.sectionLetter = "";
        this.classType = "";
        this.day = Day.MON;
        this.startTime = "00:00";
        this.location = "";
        this.duration = 0;
        this.catNum = "xxx111"
        this.instructor = "Jane Doe";
        this.additionalNotes = "";
    }

    set setTerm(newTerm: string) {
        this.term = newTerm;
    }
 }