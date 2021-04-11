"use strict";
/**
 * export default interface PageData {
    courseName: string,
    courseDescription: string,
    sections: Array<Section>
}
 */
exports.__esModule = true;
var PageData = /** @class */ (function () {
    function PageData(courseName, des) {
        this._courseName = courseName;
        this._courseDescription = des;
        this._sections = [];
    }
    Object.defineProperty(PageData.prototype, "courseName", {
        set: function (courseName) {
            this._courseName = courseName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PageData.prototype, "courseDescription", {
        set: function (courseDescription) {
            this._courseDescription = courseDescription;
        },
        enumerable: false,
        configurable: true
    });
    PageData.prototype.addSection = function (currSection) {
        this._sections.push(currSection);
    };
    return PageData;
}());
exports["default"] = PageData;
