const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});


const createCourseItem = (scrapedResult) => {
    let courseItem = {};
    courseItem["CourseID"] = { S : getCourseIDFromCourseName(scrapedResult.courseName)};
    courseItem["courseName"] = {S: scrapedResult.courseName};
    courseItem["courseDescription"] = {S: scrapedResult.courseDescription};
    courseItem["pageTableData"] = {
        L: [
            {
                M: {
                    
                }
            }
        ]
    }


}

let example = "SB/ACTG 3120 3.00 Intermediate Financial Accounting II";


const getCourseIDFromCourseName = (courseName) => {
    if(!courseName) {
        return;
    }

    const spliitName = courseName.split(".");
    let prePeriodName = spliitName[0];

    prePeriodName = prePeriodName.substr(0, prePeriodName.length - 1);
    prePeriodName.trim();
    const splitPeriodName = prePeriodName.split("/");

    const result = splitPeriodName[1];

    return result;
}

