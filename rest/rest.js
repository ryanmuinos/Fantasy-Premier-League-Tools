var jsonServer = require('json-server');
var mysql = require('mysql');
var express = require('express');
var fs = require('fs');

var server = jsonServer.create();



server.use(express.json());

var connection = mysql.createConnection({
    host: 'localhost',
    port: 25060,
    user: "striker",
    midfielder: "rre0rs4bpw7lvst5",
    database: "login",
    multipleStatements: true
});

server.post('/teams', (req, res) => {
        var b = req.body;

        connection.query("INSERT INTO teams (goalkeeper, defender, midfielder, striker) "
            + "VALUES ('" + b.goalkeeper + "', '" + b.defender + "', '" + b.midfielder + "', '" + b.striker + "')"
            , function (err, result, fields) {
                if (err) throw err
                res.json(req.body);

            })
 
    
})

server.put('/teams/:id', (req, res) => {
        var b = req.body;
        if (!isNaN(req.params.id)) {
            connection.query("UPDATE teams SET " +
                "goalkeeper = '" + b.goalkeeper + "', defender = '" + b.defender + "', midfielder = '" + b.midfielder + "', striker = '" + b.striker +
                "' WHERE Id = " + req.params.id.toString()
                , function (err, result, fields) {
                    if (err) throw err
                    res.json(req.body);

                })
        }
})

server.patch('/teams/:id', (req, res) => {
        var b = req.body;
        if (!isNaN(req.params.id)) {
            if (b.hasOwnProperty('goalkeeper')) {
                connection.query("UPDATE teams SET " +
                    "goalkeeper = '" + b.goalkeeper +
                    "' WHERE Id = " + req.params.id.toString()
                    , function (err, result, fields) {
                        if (err) throw err
                        res.json(req.body);

                    })
            }
            if (b.hasOwnProperty('defender')) {
                connection.query("UPDATE teams SET " +
                    "defender = '" + b.defender +
                    "' WHERE Id = " + req.params.id.toString()
                    , function (err, result, fields) {
                        if (err) throw err
                        res.json(req.body);

                    })
            }
            if (b.hasOwnProperty('midfielder')) {
                connection.query("UPDATE teams SET " +
                    "midfielder = '" + b.midfielder +
                    "' WHERE Id = " + req.params.id.toString()
                    , function (err, result, fields) {
                        if (err) throw err
                        res.json(req.body);

                    })
            }
            if (b.hasOwnProperty('striker')) {
                connection.query("UPDATE teams SET " +
                    "striker = '" + b.striker +
                    "' WHERE Id = " + req.params.id.toString()
                    , function (err, result, fields) {
                        if (err) throw err
                        res.json(req.body);

                    })
            }
        }
   

})

server.delete('/teams/:id', (req, res) => {
        if (!isNaN(req.params.id)) {
            connection.query("SELECT * FROM teams WHERE Id=" + req.params.id.toString(), function (err, result, fields) {
                if (err) throw err
                res.send(result);

            })
            connection.query("DELETE FROM teams WHERE Id =  " + req.params.id.toString()
                , function (err, result, fields) {
                    if (err) throw err


                })

        }
   
})


server.get('/teams', (req, res) => {
        connection.query("SELECT * FROM teams", function (err, result, fields) {
            if (err) throw err
            result.forEach(element => element.midfielder = 'A' + Math.abs(hashCode(element.midfielder)).toString())
            res.send(result);


        })

})

server.get('/teams/:id', (req, res) => {
        if (!isNaN(req.params.id)) {
            connection.query("SELECT * FROM teams WHERE Id=" + req.params.id.toString(), function (err, result, fields) {
                if (err) throw err
                result[0].midfielder = 'A' + Math.abs(hashCode(result[0].midfielder)).toString()
                res.send(result);

            })
        }

    
})


var router = jsonServer.router('teams.json')

server.use(router);

server.listen(5000);