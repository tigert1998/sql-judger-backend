"use strict";

const
  express = require("express"),
  fs = require("fs"),
  path = require("path"),
  judger = require("./judger");

const
  port = process.env.npm_package_config_apiPort,
  archivePath = path.resolve("problems");

const
  app = express();

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === request.method) {
    response.sendStatus(200);
  } else {
    next();
  }
});

app.get("/api/archive", (request, response) => {
  response.type("json");
  fs.readdir(archivePath, (error, data) => {
    let promises = [];
    data.forEach((item) => {
      promises.push(new Promise((resolve, reject) => {
        let stat = fs.lstat(path.join(archivePath, item), (error, stats) => {
          if (error) reject(error);
          else resolve(stats);
        });
      }));
    });
    Promise.all(promises).then((values) => {
      let result = [];
      for (let i = 0; i < data.length; i++) {
        if (values[i].isDirectory()) result.push(data[i]);
      }
      response.send(result);
      response.end();
    });
  });
});

app.post("/api/submitCode", (request, response) => {
  let bodyStr = '';
  request.on("data", (chunk) => {
    bodyStr += chunk.toString();
  });
  request.on("end",() => {
    let body = JSON.parse(bodyStr);
    judger.judge(3160103866, body.problemID, body.code).then((value) => {
      response.status(200).send(value);
    });
  });
});

app.get("/api/description/:problemID", (request, response) => {
  let problemID = request.params.problemID;
  fs.readFile(path.join(archivePath, problemID, 'description.md'), (error, data) => {
    if (error) {
      response.send('');
      response.end();
    } else {
      response.send(data);
      response.end();
    }
  });
});

app.listen(port, () => {
  console.log("Listening on port " + port + "...");
  console.log("sql-judger API backend is running on http://localhost:" + port);
});
