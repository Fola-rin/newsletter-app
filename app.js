const https = require("https")
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})
app.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: name
            }
        }]
    }

    const jsonData = JSON.stringify(data)
    const listID = ""
    const url = "https://us7.api.mailchimp.com/3.0/lists/587f121ed1";
    const options = {
        method: "POST",
        auth: "fola:7144460d697919e9587c35fd26f38a13-us7"

    }
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", (data) => {
            // console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end()
})

app.post("/failure.html", (req, res) => {
    res.redirect("/")
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Running on port 3000")
})


app.post("/success.html", (req, res) => {
    const city = req.body.cityName;
    const apiKey = "16787786e117b934880f5ca3c5c07ea4"
    const unit = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
    https.get(url, (response) => {
        console.log(response.statusCode);
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon
            const imgUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
            console.log(temp);
            console.log(weatherDescription);
            res.write(`<h1>The temperature in ${city} is ${temp} degrees Celcuis</h1>`)
            res.write(`<h2>The weather is currently ${weatherDescription}</h2>`);
            res.write(`<img src=${imgUrl}>`)
            res.send();
        })
    })
})

// 7144460d697919e9587c35fd26f38a13-us7
// List ID: 587f121ed1