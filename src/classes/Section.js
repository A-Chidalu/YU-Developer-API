"use strict";
exports.__esModule = true;
var Day_1 = require("../enums/Day");
var Section = /** @class */ (function () {
    function Section() {
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
    Object.defineProperty(Section.prototype, "setTerm", {
        set: function (newTerm) {
            this.term = newTerm;
        },
        enumerable: false,
        configurable: true
    });
    return Section;
}());
exports["default"] = Section;
