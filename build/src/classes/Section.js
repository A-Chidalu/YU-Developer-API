"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Day_1 = require("../enums/Day");
class Section {
    constructor() {
        this.term = "";
        this.sectionDirector = "";
        this.sectionLetter = "";
        this.classType = "";
        this.day = Day_1.Day.MON;
        this.startTime = "00:00";
        this.location = "";
        this.duration = 0;
        this.catNum = "xxx111";
        this.instructor = "Jane Doe";
        this.additionalNotes = "";
    }
    set setTerm(newTerm) {
        this.term = newTerm;
    }
}
exports.default = Section;
