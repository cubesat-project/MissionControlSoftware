const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    // GET /component-telemetry returns all componentTelemetry entries
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 'SELECT * FROM "componentTelemetry" WHERE "telemetryTypeID" = $1',
                        values: [req.query.telemetryTypeID],
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
        //     if (req.query.telemetryTypeID) {
        //         db.query("SELECT * FROM componentTelemetry WHERE telemetryTypeID = ?", req.query.telemetryTypeID, function (error, results, fields) {
        //             if (error) throw error;
        //             res.send(results);
        //         });
        //     } else {
        //         db.query("SELECT * FROM componentTelemetry", function (error, results, fields) {
        //             if (error) throw error;
        //             res.send(results);
        //         });
        //     }
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })

    // POST /component-telemetry creates a new componentTelemetry as specified by telemetryTypeID
    .post(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {

                hasBounds = req.body.hasBounds ? 1 : 0;

                const query = {
                        text: 
                            `INSERT INTO "componentTelemetry" ("telemetryTypeID", "componentID", "name", "hasBounds", "upperBound", "lowerBound")
          
                            VALUES ($1, $2, $3, $4, $5, $6)
        
                            RETURNING *
                            `,
                            values: [req.body.telemetryTypeID, 
                                    req.body.componentID, 
                                    req.body.name, 
                                    hasBounds, 
                                    req.body.upperBound, 
                                    req.body.lowerBound],
                        }
                const response = await client.query(query)
                res.json({newCompTelem: response.rows});
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     // NOTE upperBound and lowerBound can be null
        //     hasBounds = req.body.hasBounds ? 1 : 0;
        //     var insertParams = [req.body.telemetryTypeID, req.body.componentID, req.body.name, hasBounds, req.body.upperBound, req.body.lowerBound];
        //     db.query('INSERT INTO componentTelemetry (telemetryTypeID, componentID, name, hasBounds, upperBound, lowerBound) VALUES (?, ?, ?, ?, ?, ?)', insertParams, (error, results, fields) => {
        //         if (error) throw error;
        //         res.json({newCompTelem: results.insertId});
        //         //res.json(200);
        //     });
        // } catch (err) {
        //     console.log(err);
        //     res.json(err);
        // }
    })

router.route('/:ID')
    // GET /component-telemetry/:componentID returns all componentTelemetries associated with the componentID parameter specified
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 'SELECT * FROM "componentTelemetry" WHERE "componentID" = $1',
                        values: [req.params.ID],
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
        //     db.query("SELECT * FROM componentTelemetry WHERE componentID = ?;", req.params.ID, function (error, results, fields) {
        //         if (error) throw error;
        //         res.send(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })

    // PUT /component-telemetry/:componentTelemetryID updates the fields of the componentTelemetryID specified
    .put(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `UPDATE "componentTelemetry" 
                            
                            SET "telemetryTypeID" = $1,
                                "componentID" = $2,
                                "name" = $3,
                                "hasBounds" = $4,
                                "upperBound" = $5,
                                "lowerBound" = $6,

        
                            WHERE
                                "componentTelemetryID" = $7

                            RETURNING *
                          `,
                          values: [req.body.telemetryTypeID, 
                                  req.body.componentID, 
                                  req.body.name, 
                                  req.body.hasBounds, 
                                  req.body.upperBound, 
                                  req.body.lowerBound, 
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
        //     var updateParams = [req.body.telemetryTypeID, req.body.componentID, req.body.name, req.body.hasBounds, req.body.upperBound, req.body.lowerBound, req.params.ID];

        //     db.query("UPDATE componentTelemetry SET telemetryTypeID = ?, componentID = ?, name = ?, hasBounds = ?, upperBound = ?, lowerBound = ? " +
        //         "WHERE componentTelemetryID = ?", updateParams, function (error, results, fields) {
        //         if (error) throw error;
        //         res.json({updateCompTelem:results.insertId});
        //         //res.sendStatus(200);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })

    // DELETE /component-telemetry/:componentTelemetryID deletes the componentTelemetryID entry
    .delete(parseUrlencoded, parseJSON, (req, res) => {
        try {
            db.query("DELETE FROM componentTelemetry WHERE componentTelemetryID = ?", req.params.ID, function(error, results, fields) {
                if (error) throw error;
                res.json({byeCompTelem:results.insertId});
                //res.sendStatus(200);
            })
        } catch(err) {
            console.log(err);
            res.send(err);
        }
    })

module.exports = router;