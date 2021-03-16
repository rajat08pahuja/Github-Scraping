let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");

function extractRepoLinks(url) {
    request(url, cb);
}

function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractData(html);
    }
}

function dirCreater(src) {
    if (fs.existsSync(src) == false) {
        fs.mkdirSync(src);
    }
}

function createFile(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.openSync(filePath, "w");
    }
}

function extractData(html) {
    let selTool = cheerio.load(html);
    let topicElementArr = selTool("h1");
    let topicName = selTool(topicElementArr[0]).text().trim().split("\n")[0];
    let pathOfFolder = path.join(__dirname, topicName);
    dirCreater(pathOfFolder);
    console.log(topicName);

    let reposLinkArr = selTool("h1.f3.color-text-secondary.text-normal.lh-condensed");

    for (let i = 0; i < 8; i++) {
        let aArr = selTool(reposLinkArr[i]).find("a");
        let repoLink = selTool(aArr[1]).attr("href");
        console.log("https://github.com" + repoLink);
        let fileName = repoLink.split("/").pop();
        let filePath = path.join(pathOfFolder, fileName + ".json");
        createFile(filePath);

        let issuePageLink = "https://github.com" + repoLink + "/issues";
        getIssuesData(issuePageLink, filePath);
    }

    console.log("''''''''''''''''''''''''''''''");
}

function getIssuesData(url, filePath) {
    request(url, IssuePagecb);
    function IssuePagecb(err, response, html) {
        if (err) {
            console.log(err);
        } else {
            extractIssues(html);
        }
    }

    function extractIssues(html) {
        let selTool = cheerio.load(html);
        let arr = [];
        let issuesAnchorTag = selTool(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open");

        for (let i = 0; i < issuesAnchorTag.length; i++) {
            let link = "https://github.com" + selTool(issuesAnchorTag[i]).attr("href");
            let issueName = selTool(issuesAnchorTag[i]).text();

            let issueObj = {
                Link: link,
                IssueName: issueName
            }
            arr.push(issueObj);
        }

        let fcupdated = JSON.stringify(arr);
        fs.writeFileSync(filePath, fcupdated);
    }
}


module.exports = {
    extractRepoLinks: extractRepoLinks
}