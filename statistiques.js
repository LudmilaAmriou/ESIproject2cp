const fs = require('fs');
const express = require('express');

const http = require('http');
const app = http.createServer((req, res) => {
    res.setHeader('content-type', 'text/html');
    fs.readFile('./views/statistics.ejs', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.write(data);
            res.end();
        }
    });
});
app.listen(5000, 'localhost', () => {
    console.log('statistics');
})