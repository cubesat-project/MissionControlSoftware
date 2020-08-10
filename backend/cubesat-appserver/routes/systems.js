const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')

    // GET /systems returns all systems
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = 'SELECT * FROM subsystems';
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
        //     db.query("SELECT * FROM systems", function (error, results, fields) {
        //         if (error) throw error;
        //         res.send(results);
        //     })
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })

    // POST /systems adds a new system to the systems table
    .post(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `INSERT INTO subsystems (systemName)
          
                            VALUES ($1)
        
                            RETURNING *
                            `,
                            values: [req.body.systemName],
                        }
                const response = await client.query(query)
                res.json({newSys: response.rows});
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     db.query("INSERT INTO systems (systemName) VALUES (?)", req.body.systemName, function (error, results, fields) {
        //         if (error) throw error;
        //         console.log(results);
        //         res.json({newSys:results.insertId});
        //         //res.sendStatus(200);
        //     })
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

router.route('/:ID')
    // PUT /systems/:systemID updates a system name
    .put(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `UPDATE subsystems 
                            
                            SET subsystemName = $1,
        
                            WHERE
                                subsystemID = $2

                            RETURNING *
                          `,
                          values: [req.body.systemName, req.params.ID],
                        }
                const response = await client.query(query)
                res.json({updateSys: response.rows});
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));
        
        // try {
        //     var updateParams = [req.body.systemName, req.params.ID];
        //     db.query("UPDATE systems SET systemName = ? WHERE systemID = ?", updateParams, function (error, results, fields) {
        //         if (error) throw error;
        //         res.json({updateSys:results.insertId});
        //         //res.sendStatus(200);
        //     })
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })

    // DELETE /systems/:systemID deletes a system, its components, and those components' componentTelemetries
    .delete(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // delete all component telememetries whose components belong to this sytem
            db.query("DELETE FROM componentTelemetry WHERE componentID IN (SELECT componentID FROM components WHERE systemID = ?)", req.params.ID, function (error, results, fields) {
                if (error) throw error;

                try {
                    db.query("DELETE FROM components WHERE systemID = ?", req.params.ID, function(error, results, fields) {
                        if (error) throw error;
                        try {
                            db.query("DELETE FROM systems WHERE systemID = ?", req.params.ID, function(error, results, fields) {
                                if (error) throw error;
                                console.log(results);
                                res.json({byeSys: results.insertId});
                                //res.sendStatus(200);
                            })
                        } catch (err) {
                            console.log(err);
                            res.send(err);
                        }
                    })
                } catch (err) {
                    console.log(err);
                    res.send(err);
                }
            })
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });


module.exports = router;