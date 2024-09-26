import AWS from 'aws-sdk';
import { BigQuery } from '@google-cloud/bigquery';


const dynamodb = new AWS.DynamoDB.DocumentClient({
     region: 'us-east-1',
     accessKeyId: 'ASIATCIMJNYWSHUUV2NO',
     secretAccessKey: 'FdW5983QA0wwjreSoDFxFA6XSxAatL9vVmjSV4Hz',
     sessionToken: 'IQoJb3JpZ2luX2VjEKH//////////wEaCXVzLXdlc3QtMiJIMEYCIQCtdHn1zsjzAYu24KW1Ve3mBDATAB9O8tD2Ik3a8yB/TgIhAMZEKeTAeQWchJyP3RsQiCvK8z3KBBheL/oira4KW+alKqYCCHoQARoMMjExMDE2MDUyMjY5IgwPrPi+7vMWRycCgucqgwLRhelVmsmEeTJNza7HXLLyjFx4C9RpDEWTmOjTHzWEpja3WEwrzy1cOuCOiDwLYD0X2sairXHTlbdffRAZSLcbFTgsm4ezTxx0vf8DN0SvsUvij0L6hS4jiB5jctcdNS8FoG7klz85ZnqKetFcC2r023SSGlSeY4a3TKlRe6szU8h085CtsMMT7TFXS91IH357uy5QiUpAKeRafoHNmy88vD8fkixrJO22SnvTeO9tYJTizcQK7eXQ2fV/8v0BpICRyNXubo8tUg/MKYucfmykkB7N77El3r41KqxR297S5Tokzo2C97HDKrOzIdzU+5zIGK2KQebmTbKAZV4FmZsdlrSxMJqa+rQGOpwBG6VBnYtgUogPcqrZOsT3RLyEWY2E8OM3RPTcxi1zXfosrums6ReICJyP37vsTdSlzKyJSRhVuLv6r3XPb7XCLBNzZEGT3Lc49M7nDi6vNwz+7yp0YAuSFg7WDSQGrua8df6A3RHsutjT4aLXpA83zE2DIHS8iC9bDxbhu7ODMyfxzOocV5+Ong/0/Qg65fkBlRWVXplvShHVWAV1',
 });
 console.log("After DynamoDB", dynamodb);
 // Initialize BigQuery
 const bigquery = new BigQuery({
     projectId: 'serverless-project-429820',
     keyFilename: 'serverless-project-429820-c5e312b2368f.json'
 });
 
 console.log("After BigQuery");

 const datasetId = 'serverless';
 const tableId = 'userdetails';
 
 export const handler = async (event) => {
     try {
         const deleteOldData = `DELETE FROM \`${datasetId}.${tableId}\` WHERE TRUE`;
         await bigquery.query({query: deleteOldData});
         console.log("Data Deleted");
         const params = {
             TableName: 'Users'
         };
         const data = await dynamodb.scan(params).promise();

         console.log("Data", data);
         const items = data.Items;
 
         // Prepare rows for BigQuery
         const rows = items.map(item => ({
             id: item.id, // Replace with your unique identifier field
             role: item.role,
             name: item.name,
             email: item.email
         }));
 
         // Insert data into BigQuery
         await bigquery.dataset(datasetId).table(tableId).insert(rows);
 
         console.log('Data exported successfully');
 
         return {
             statusCode: 200,
             body: JSON.stringify('Data exported successfully')
         };
     } catch (error) {
         console.error('Error exporting data:', error);
 
         return {
             statusCode: 500,
             body: JSON.stringify('Error exporting data')
         };
     }
 };