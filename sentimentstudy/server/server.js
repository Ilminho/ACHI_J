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

const testcaseFile = '../../finalTestCases.json';

app.get('/testcase', (req, res) => {
    const data = fs.readFileSync(testcaseFile, 'utf8');
    const testCase = JSON.parse(data);
    if (index > testCase.tests.length-1){
        res.statusCode = 200;
        res.json({"finished": true})
        index = 0;
        return;
    }
    const Testcase = testCase.tests[index];
    index = index + 1
    res.statusCode = 200;
    res.json(Testcase);
});

app.post('/result', (req,res) => {
    const opinion = req.body.opinion;
    const testId = req.body.testCaseId;
    const colorsHighlighted = req.body.colorsHighlighted;
    let colRet;
    if (colorsHighlighted) {
        colRet = 1;
    } else {
        colRet = 0;
    }
    const data = fs.readFileSync(testcaseFile, 'utf8');
    const testData = JSON.parse(data);
    for (var i = 0; i < testData.tests.length; i++) {
        if (testData.tests[i].testcaseId === testId) {
          caseFound = true
          testData.tests[i].humanEstimate.push(opinion);
          if (typeof testData.tests[i].highlightedColors !== 'undefined') {
            testData.tests[i].highlightedColors.push(colRet);
          } else {
            testData.tests[i].highlightedColors = [colRet];
          }
          const average = testData.tests[i].humanEstimate.reduce((a, b) => a + b, 0) / testData.tests[i].humanEstimate.length;
          testData.tests[i].averageHumanEstimate = average;
          break;
        }
        if(i == testData.tests.length-1){
            caseFound = false
        }
    } 
    if(caseFound){
        fs.writeFileSync(testcaseFile, JSON.stringify(testData, null, 2));
        res.status(201).send({res: 'Opinion submitted successfully'});
    }
    else{
        res.status(404).send({res: 'Case not found'});
    }
});

app.post('/resetTestcases', (req,res) => {
    const reset = req.body.resetTestcases;
    if (reset === true) {
        index = 0;
        res.status(201).send({"resetSuccess": true});
    } else {
        res.status(418).send({res: 'Error in resetting testcases'});
    }
});

app.post('/resetHard', (req,res) => {
    const reset = req.body.resetHard;
    if (reset === true) {
        const data = fs.readFileSync(testcaseFile, 'utf8');
        const testData = JSON.parse(data);
        index = 0;
        for (var i = 0; i < testData.tests.length; i++) {
            testData.tests[i].humanEstimate = [];
            testData.tests[i].averageHumanEstimate = null;
            testData.tests[i].highlightedColors = [];
        }
        fs.writeFileSync(testcaseFile, JSON.stringify(testData, null, 2));
        res.status(201).send({"resetSuccess": true});
    } else {
        res.status(418).send({res: 'Error in hard reset'});
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});