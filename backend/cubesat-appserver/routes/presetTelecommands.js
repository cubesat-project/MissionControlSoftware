const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    .post(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `INSERT INTO "presetTelecommands" ("telecommandID", 
                                                               "batchID", 
                                                               "secondDelay", 
                                                               "minuteDelay", 
                                                               "hourDelay", 
                                                               "dayDelay", 
                                                               "priorityLevel", 
                                                               "commandParameters")
          
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        
                            RETURNING *
                            `,
                            values: [req.body.telecommandID, 
                                     req.body.batchID, 
                                     req.body.secondDelay, 
                                     req.body.minuteDelay, 
                                     req.body.hourDelay, 
                                     req.body.dayDelay, 
                                     req.body.priorityLevel, 
                                     req.body.commandParameters]
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
        //     var insertParameters = [req.body.telecommandID, req.body.batchID, req.body.secondDelay, req.body.minuteDelay, req.body.hourDelay, req.body.dayDelay, req.body.priorityLevel, req.body.commandParameters];

        //     // using this pattern of using ? in our query builder does the escaping for us! No need to worry about sql injection
        //     db.query('INSERT INTO presetTelecommands(telecommandID, batchID, secondDelay, minuteDelay, hourDelay, dayDelay, priorityLevel, commandParameters) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', insertParameters, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

router.route('/:ID')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `SELECT "presetTelecommands".*, "telecommands"."name" FROM "presetTelecommands" 

                            JOIN "telecommands" ON "presetTelecommands"."telecommandID" = "telecommands"."telecommandID" 

                            WHERE "batchID" = ? 

                            ORDER BY "dayDelay", "hourDelay", "minuteDelay", "secondDelay"`,

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
        //     var batchID = req.params.id;
            
        //     db.query('SELECT presetTelecommands.*, telecommands.name from presetTelecommands JOIN telecommands on presetTelecommands.telecommandID = telecommands.telecommandID WHERE batchID = ? ORDER BY dayDelay, hourDelay, minuteDelay, secondDelay', batchID, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //     });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })
    .put(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `UPDATE "presetTelecommands" 
                            
                            SET "secondDelay" = $1,
                                "minuteDelay" = $2,
                                "hourDelay" = $3,
                                "dayDelay" = $4,
                                "priorityLevel" = $5,
                                "commandParameters" = $6,
        
                            WHERE "presetTelecommandID" = $7

                            RETURNING *
                          `,
                          values: [req.body.secondDelay, 
                                   req.body.minuteDelay, 
                                   req.body.hourDelay, 
                                   req.body.dayDelay, 
                                   req.body.priorityLevel, 
                                   req.body.commandParameters, 
                                   req.params.ID]
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
        //     var presetTelecommandID = req.params.id;
        //     var updateParams = [req.body.secondDelay, req.body.minuteDelay, req.body.hourDelay, req.body.dayDelay, req.body.priorityLevel, req.body.commandParameters, presetTelecommandID];
            
        //     db.query(`UPDATE presetTelecommands SET secondDelay = ?, minuteDelay = ?, hourDelay = ?, dayDelay = ?, priorityLevel = ?, commandParameters = ? WHERE presetTelecommandID = ?;`, updateParams, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })
    .delete(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `DELETE FROM "presetTelecommands" 

                            WHERE "presetTelecommandID" = $1

                            RETURNING *
                          `,
                          values: [req.params.ID]
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
        //     var presetTelecommandID = req.params.id;
            
        //     db.query('DELETE FROM presetTelecommands WHERE presetTelecommandID = ?', presetTelecommandID, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

module.exports = router;