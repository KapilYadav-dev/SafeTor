const express=require('express')
const app=express()
const request = require('request')
const cheerio = require('cheerio')
const rateLimit = require("express-rate-limit");
var path = require('path');
var baseurl="https://torrentzeu.org/data.php?q="
var port=process.env.PORT||8080
var data=[]
var titleList=[],seedsList=[],leechesList=[],sizeList=[],magnetList=[]
const limiter = rateLimit({
    windowMs:  5000,
    max: 1,
    message: "We are hosted on free server, please reduce calls."
  })

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.get('/search/:query',limiter,(req,res)=>{
    var url=baseurl+req.params.query
    request(url,async (error,response,html)=>{
        var $=cheerio.load(html)
        var table=$('#table').find('tr')
        table.each(function (i, e) {
            var a=$(this)
            console.log(i)
            var title=a.find('td').eq(0).text().trim()
            var seeds=a.find('td').eq(1).text().trim()
            var leeches=a.find('td').eq(2).text().trim()
            var size=a.find('td').eq(3).text().trim()
            var magnet=a.find('td').eq(4).find('a').attr('href')
            titleList[i]=title
            seedsList[i]=seeds
            leechesList[i]=leeches
            sizeList[i]=size
            magnetList[i]=magnet
        })
        for(var i=1;i<table.length;i++)
        {
            var object={
                "title":titleList[i],
                "seeds":seedsList[i],
                "leeches":leechesList[i],
                "size":sizeList[i],
                "magnet":magnetList[i]
            }
            data.push(object)
        }
        data.push(object)
        res.send(data)
        empty()
    })
})

app.listen(port,()=>{
    console.log("Server running on port "+port)
})

function empty() {
    titlelist=[],seedsList=[],leechesList=[],sizeList=[],magnetList=[],data=[]
}