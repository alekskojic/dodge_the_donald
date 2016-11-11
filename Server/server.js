const express = require('express');
const app = express();
const axios = require('axios');

// start Express on port 8080
app.listen(8080, () => {
	console.log('Server Started on http://localhost:8080');
	console.log('Press CTRL + C to stop server');
});

const url = 'http://partners.api.skyscanner.net/apiservices/pricing/v1.0/';
axios({
    method: 'post',
    url: url,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    },
    params: {
        apiKey: 'so481311174223202296985143528524',
        country: 'CA',
        currency: 'CAD',
        locale: 'en-CA',
        originplace: 'YYZ',
        destinationplace: 'JFK',
        outboundate: new Date('2016-11-20'),
    }
})
.then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });