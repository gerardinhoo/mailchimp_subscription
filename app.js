const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require('node-fetch');
const https = require("https")


const app = express();

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.post("/signup", (req, res) => {
  const {firstName, lastName, email} = req.body

  // Makeing sure all fields are filled
  if(!firstName || !lastName || !email) {
    res.redirect("/failure.html");
    return;
  }

  // Construct request data
   const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const postData = JSON.stringify(data);
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  fetch('https://us19.api.mailchimp.com/3.0/lists/24c9ee5de3', {
    method: 'POST',
    headers: {
       Authorization: "auth + API_KEY"
    },
    body: postData,
    agent: httpsAgent

  })
    .then(res.statusCode === 200 ?
      res.redirect('/success.html') :
      res.redirect('/failure.html'))
    .catch(err => console.log(err))
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Listening to App on ${PORT}`));