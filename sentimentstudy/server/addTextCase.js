const fs = require('fs');
const uuid = require('uuid');


const data2 = fs.readFileSync('../../generated_news_20240409.json', 'utf8');

let dataToWrite = JSON.parse(data2);

console.log(uuid.v4());

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function calcTruePostiviness(array) {
    let sum = 0;
    array.forEach(element => {
        if(element.isPositive) {
            sum += 1;
        }
    });

    return sum / array.length;
}


const data = fs.readFileSync('../../realnewsWithSentiment.json', 'utf8');
let realnews = JSON.parse(data);


let i = 0;

while( i < 4) {
    
    const content = []
    const sentimentEstimate = 0;

    let y = 0;
    while(y < 6){
        const newsIndex = getRandomInt(0, realnews.length);
        content.push({
            newsId : uuid.v4(),
            header : realnews[newsIndex].header,
            leadText : realnews[newsIndex].leadText,
            isPositive : realnews[newsIndex].isPositive
        })
        realnews = realnews.filter((v,i) => i !== newsIndex);

        console.log(newsIndex);
        y++;
    }
    
    const objectToWrite = {
        testcaseId : uuid.v4(),
        content,
        truePositiveness : calcTruePostiviness(content),
        sentimentEstimate,
        highlightedColors : [],
        humanEstimate : [],
        aiGenerated : false,
    }

    dataToWrite.tests.push(objectToWrite);
    
    i++;
}

dataToWrite.tests.forEach(element => {
    if(element.aiGenerated === undefined) {
        element.aiGenerated = true;
    }
});
fs.writeFileSync('../../finalTestCases.json', JSON.stringify(dataToWrite, null, 2));

