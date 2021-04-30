// const AWS = require('aws-sdk');
// AWS.config.update({region:'us-east-2'});

// var dynamodb = new AWS.DynamoDB();

// const params = {
//     Key: {
//         CourseID: {
//             S: "ACTG3120"
//         }
//     },
//     TableName: "CourseTable"
// };

// dynamodb.getItem(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else {
//         console.log(data.Item.SectionTables.L.forEach(map => console.log(map)));
//     }          
//   });