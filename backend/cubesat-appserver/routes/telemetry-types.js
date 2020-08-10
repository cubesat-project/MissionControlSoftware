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
                const query = 'SELECT * FROM "telemetryTypes"';
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
        //     db.query(`SELECT * FROM "telemetryTypes"`, function (error, results, fields) {
        //         if (error) throw error;
        //         res.send(results);
        //     });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })

    .post(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `INSERT INTO "telemetryTypes" ("telemetryUnit", "name")
          
                            VALUES ($1, $2)
        
                            RETURNING *
                            `,
                            values: [req.body.telemetryUnit, req.body.name]
                        }
                const response = await client.query(query)
                res.json({newTelemType: response.rows});
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     var insertParams = [req.body.telemetryUnit, req.body.name];
        //     db.query('INSERT INTO telemetryTypes (telemetryUnit, name) VALUES (?, ?)', insertParams, (error, results, fields) => {
        //         if (error) throw error;
        //         res.json({newTelemType:results.insertId});
        //         //res.json(200);
        //     });
        // } catch (err) {
        //     console.log(err);
        //     res.json(err);
        // }
    });

router.route('/:ID')
    .put(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `UPDATE "telemetryTypes" 
                            
                            SET "name" = $1,
                                "telemetryUnit" = $2,
        
                            WHERE "telemetryTypeID" = $3

                            RETURNING *
                          `,
                          values: [req.body.name, req.body.telemetryUnit, req.params.ID]
                        }
                const response = await client.query(query)
                res.json({updateTelemetryType: response.rows});
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     var updateParams = [req.body.name, req.body.telemetryUnit, req.params.id];

        //     db.query("UPDATE telemetryTypes SET name = ?, telemetryUnit = ? " +
        //         "WHERE telemetryTypeID = ?", updateParams, function (error, results, fields) {
        //         if (error) throw error;
        //         res.json({updateTelemetryType:results.insertId});
        //         //res.sendStatus(200);
        //     });
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
                            `DELETE FROM "telemetryTypes" 

                            WHERE "telemetryTypeID" = $1

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
        //     db.query("DELETE FROM telemetryTypes WHERE telemetryTypeID = ?", req.params.id, function(error, results, fields) {
        //         if (error) throw error;
        //         res.json({byeTelemetryType:results.insertId});
        //         //res.sendStatus(200);
        //     })
        // } catch(err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })

module.exports = router;