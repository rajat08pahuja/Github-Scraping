let request = require("request");
let cheerio = require("cheerio");
let repoPageObj = require("./extractRepoList");

request("https://github.com/topics" , cb);

function cb(err , response , html){
    if(err){
        console.log(err);
    } else{
        extractTopics(html);
    }
}

function extractTopics(html){
    let selTool = cheerio.load(html);
    let topicBox = selTool(".container-lg.p-responsive.mt-6 ul li a");

    for(let i = 0 ; i < topicBox.length ; i++){
        // let topicName = selTool(topicBox[i]).text();
        let link = selTool(topicBox[i]).attr("href");
        // topicName = topicName.trim().split("\n")[0];
        let completeUrl = "https://github.com/" + link;
        // console.log(topicName + " " + completeUrl);
        repoPageObj.extractRepoLinks(completeUrl);
    }
}