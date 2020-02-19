const fetch = require('node-fetch');
setInterval(async() => {
    try {
        await fetch('https://brunch-prateek.herokuapp.com/api/general/meals');
    } catch (error) {
    }
}, 600000);