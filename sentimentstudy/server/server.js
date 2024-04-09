var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const jsonfile = require('jsonfile');
const fs = require('fs');
const filePath = 'opinions.json';
var app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/news', (req, res) => {
    let content = {
        testCaseId: 1,
        news: [
            {newsId: 1, header: "News 1", leadText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", negativePositive: 0.8},
            {newsId: 2, header: "News 2 Header", leadText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", negativePositive: 0.1},
            {newsId: 3, header: "News 3 HeaderHeader", leadText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", negativePositive: 0.4},
            {newsId: 4, header: "News 4 HeaderHeader Header", leadText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", negativePositive: 1},
            {newsId: 5, header: "News 5 HeaderHeader HeaderHeader", leadText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", negativePositive: 0},
            {newsId: 6, header: "News 6 HeaderHeader HeaderHeader Header", leadText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", negativePositive: 0.5},
            {newsId: 7, header: "News 7 HeaderHeader HeaderHeader HeaderHeader", leadText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", negativePositive: 0.66},
        ],
        truePositiviness: 0.78,
        sentimentEstimate: 0.81,
        humanEstimate: [],
        averageHumanEstimate: null

    }
    //Pyydä LLM uutiset ja niiden SentimentAI tulokset.
    //Lähetä uutiset ja tulokset.
    res.statusCode = 200;
    res.json(content);
});

app.post('/opinion', (req,res) => {
    const opinion = req.body;
    console.log(opinion)
    if (fs.existsSync(filePath)) {
        jsonfile.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
    
            if (!Array.isArray(data)) {
                data = [opinion];
            } else {
                data.push(opinion);
            }
            jsonfile.writeFile(filePath, data, { spaces: 2 }, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Data appended successfully!');
            });
        });
    } else {
        jsonfile.writeFile(filePath, [opinion], { spaces: 2 }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('File created with initial data!');
        });
    }
    res.status(201).send({res: 'Opinion submitted successfully'});
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});