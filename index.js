# Capital-City-Quiz
import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "pgadmin123",
    port: 5432,
});

db.connect();

let quiz = [];
db.query("SELECT * FORM capitals",(err,res)=>{
    if(err) {
        console.error("Error executing query",err.stack);
    } else {
        quiz = res.rows;
    }
    db.end();
});

const app = express();
const port = 3000;

let totalCorrect = 0;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let currentQuestion = {};

app.get("/",async(req,res)=>{
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs",{question: currentQuestion});
});

app.get("/submit",(req,res)=>{
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if(currentQuestion.capital.toLowerCase() === answer.toLowerCase())
    {
        totalCorrect++;
        console.log(totalCorrect);
        isCorrect = true;
    }

    nextQuestion();
    res.render("index.ejs",{
        question: currentQuestion,
        wasCorrect: isCorrect,
        totalScore: totalCorrect,
    });
});

async function nextQuestion(){
    const randomCountry = quiz[Math.floor(Math.random()*quiz.length)];
    currentQuestion = randomCountry;
}

app.listen(port,()=>{
    console.log(`server running on ${port}`);
});
