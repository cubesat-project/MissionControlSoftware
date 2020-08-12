const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = 'SELECT * FROM "telecommands"'
                const response = await client.query(query)
                res.json(response.rows);
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     db.query("SELECT * FROM telecommands;", function (error, results, fields) {
        //         if (error) throw error;

        //         res.send(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })
    .post(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()

            console.log(req.body)
            try {
                const query = {
                        text: 
                            `INSERT INTO "telecommands" ("componentID", 
                                                         "command", 
                                                         "name", 
                                                         "defaultPriorityLevel", 
                                                         "bandwidthUsage", 
                                                         "powerConsumption", 
                                                         "archived")
          
                            VALUES ($1, $2, $3, $4, $5, $6, $7)
        
                            RETURNING *
                            `,
                            values: [req.body.componentID, 
                                     req.body.command, 
                                     req.body.name, 
                                     req.body.defaultPriorityLevel, 
                                     req.body.bandwidthUsage, 
                                     req.body.powerConsumption, 
                                     req.body.archived]
                        }
                const response = await client.query(query)
                res.json(response.rows);
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     var insertParameters = [req.body.componentID, req.body.command, req.body.name, req.body.defaultPriorityLevel, req.body.bandwidthUsage, req.body.powerConsumption, req.body.archived];

        //     // using this pattern of using ? in our query builder does the escaping for us! No need to worry about sql injection
        //     db.query('INSERT INTO telecommands (componentID, command, name, defaultPriorityLevel, bandwidthUsage, powerConsumption, archived) VALUES (?, ?, ?, ?, ?, ?, ?)', insertParameters, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

router.route('/:id')
    .delete(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `UPDATE "telecommands" 
                            
                            SET "archived" = 1
        
                            WHERE "telecommandID" = $1

                            RETURNING *
                           `,
                          values: [req.params.id]
                        }
                const response = await client.query(query)
                res.json(response.rows);
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     var telecommandToDelete = req.params.id;
            
        //     db.query('UPDATE telecommands SET archived = 1 WHERE telecommandID = ?', telecommandToDelete, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

module.exports = router;