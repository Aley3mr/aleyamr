const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/failure",function(req,res){
    res.redirect("/");
});

app.post("/", function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);
    var url = "https://us21.api.mailchimp.com/3.0/lists/29f05fcca1";

    const options = {
        method: "POST",
        auth: "aley:a77d94a65254134311d71c4ae92ebb3d-us21"
    };

    const request = https.request(url, options, function(response) {
        var s = "";

        response.on("data", function(data) {
            console.log(JSON.parse(data));

            s += data;
        });

        response.on("end", function() {
            var responseData = JSON.parse(s);
            var errorCount = responseData.error_count;

            if (errorCount === 0) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT||3000, function() {
    console.log("Server is running on port 3000");
});
