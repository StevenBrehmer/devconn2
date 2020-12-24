# devconn

social network for developers.

Mongo, Express, React/Redux, Node app to host developer social media information.

Tutorial followed by udemy course
https://www.udemy.com/mern-stack-front-to-back/learn/v4/content

## Installing & Running

### npm install --prefix client
installs all dependencies.



## Files to Configure

add file /config/default.json

insert:
{   
    "mongouri": "mongoconnectionstring"
}


add file /config/db.js





will need to create
/config/keys.js

module.exports = {
mongoURI: "mongodb://user:pass@link:port/dbname",
secretOrKey: "secretKeyForHashing" // just a string of whatever
};

