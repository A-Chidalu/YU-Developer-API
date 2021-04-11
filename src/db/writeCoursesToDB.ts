const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});

var dynamodb = new AWS.DynamoDB();

export const writeCourseToDB = (courseJSON: any) => {
    if(!courseJSON) return;

    const result = convertResultToMarshelledJSON(courseJSON);

    const params = {
        TableName: "CourseTable",
        Item: result
    }

    console.log(params);

    dynamodb.putItem(params, (err: any, data: any) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Success:", data);
        }
    })
}

const convertResultToMarshelledJSON = (scrapedResult: any) => {
    if(!scrapedResult) return;
    
    if(typeof scrapedResult === "string" ) {
        scrapedResult = JSON.parse(scrapedResult);
    }
    let courseItem =  {
        CourseID: getCourseIDFromCourseName(scrapedResult.courseName),
        courseName: scrapedResult.courseName,
        courseDescription: scrapedResult.courseDescription,
        studySession: "FW",
        sections: scrapedResult.pageTableData
    };

    return AWS.DynamoDB.Converter.marshall(courseItem);
}

const getCourseIDFromCourseName = (courseName: any) => {
    if(!courseName) {
        return;
    }

    const spliitName = courseName.split(".");
    let prePeriodName = spliitName[0];

    prePeriodName = prePeriodName.substr(0, prePeriodName.length - 1);
    prePeriodName.trim();
    const splitPeriodName = prePeriodName.split("/");

    const result = splitPeriodName[1];

    return result.replace(" ", "");
}






