const express = require('express');
const request = require('request');

//Express configuration
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

// app.locals.url = 0;
// app.locals.frequency;
// app.locals.email = 0;
// app.locals.mob = 0;


//Index page render
app.get('/', function (req, res) {
    res.render('index');
});

app.post('/monitor', (req, res) =>{
    const {url,frequency,email,mob} = req.body;
    if(frequency === "Daily"){
        frequency = 1440;
    }


    //Mainvariables

    let urlToCheck = url;
    let checkingFrequency = frequency * 60000; //first number represent the checkingFrequency in minutes

    //SendGrid Email
    const SENDGRID_APY_KEY = 'AA.AAAA_AAAAAAAAAAAAA.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    /* sir/madam, i tried to register at sendgrid to get api key, but they are saying to conatct support,
     i have attached a ss related to that also. so i have written the logic only here. */
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(SENDGRID_APY_KEY);
    const emailFrom = 'ranknitin14@gmail.com';
    let emailsToAlert = email;


    let intervalsPerDay = 1440 / (checkingFrequency / 60000);

    console.log( 'intervals created are ' + intervalsPerDay);
    //Main function
    let check_function = setInterval(function () {

        request(urlToCheck, function (err, res, body) {
            //if the request fail
            if (err) {
                console.log(`Request Error - ${err}`);
                // Email Alert Notification
                const msg = {
                    to: emailsToAlert,
                    from: emailFrom,
                    subject: `Something Wrong Detected - ${urlToCheck}`,
                    html: `Something Went Wrong! <a href="${urlToCheck}"> ${urlToCheck} </a> status code is ${res.statusCode} `,
                };
                sgMail.send(msg)
                    .then(()=>{console.log("Alert Email Sent!");})
                    .catch((emailError)=>{console.log(emailError);});
            }else{
                console.log("test : the status code recieved is (website is working fine!) : " + res.statusCode);
            }
        });
    }, checkingFrequency);


    res.render("service_started", {test : app.locals.url});

});



//To test Global Access of variable
app.get("/test", (req, res) =>{
    res.send(app.locals.frequency);
})




//Server start
app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`)
});
