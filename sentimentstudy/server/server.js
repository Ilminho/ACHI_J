var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');
const filePath = 'opinions.json';
var app = express();
app.use(bodyParser.json());
app.use(cors());
var index = 0;
let caseFound = false;

app.get('/testcase', (req, res) => {
    const data = fs.readFileSync('../../testcase.json', 'utf8');
    const testCase = JSON.parse(data);
    if (index > testCase.tests.length-1){
        res.statusCode = 200;
        res.json({"finished": true})
    }
    const Testcase = testCase.tests[index];
    index = index + 1
    res.statusCode = 200;
    res.json(Testcase);
});

app.post('/result', (req,res) => {
    const opinion = req.body.opinion;
    const testId = req.body.testCaseId;
    const data = fs.readFileSync('../../testcase.json', 'utf8');
    const testData = JSON.parse(data);
    for (var i = 0; i < testData.tests.length; i++) {
        if (testData.tests[i].testcaseId === testId) {
          caseFound = true
          testData.tests[i].humanEstimate.push(opinion);
          const average = testData.tests[i].humanEstimate.reduce((a, b) => a + b, 0) / testData.tests[i].humanEstimate.length;
          testData.tests[i].averageHumanEstimate = average;
          break;
        }
        if(i == testData.tests.length-1){
            caseFound = false
        }
    } 
    if(caseFound){
        fs.writeFileSync('../../testcase.json', JSON.stringify(testData, null, 2));
        res.status(201).send({res: 'Opinion submitted successfully'});
    }
    else{
        res.status(404).send({res: 'Case not found'});
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});