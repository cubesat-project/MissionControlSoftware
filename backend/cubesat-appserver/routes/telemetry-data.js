const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');
var moment = require('moment');

router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                if (req.query.startDate) {
                    var getParams = [moment(req.query.startDate).utc(false), moment(req.query.endDate).utc(false)];

                    var query = {
                            text: 'SELECT * FROM "telemetryData" WHERE "collectionDateTime" BETWEEN $1 AND $2',
                            values: [moment(req.query.startDate).utc(false), moment(req.query.endDate).utc(false)]
                            }
                    var response = await client.query(query)
                    res.json(response.rows);

                } else {
                    
                    var query = 'SELECT * FROM "telemetryData"';
                    var response = await client.query(query)
                    res.json(response.rows);
                }

            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

    })
    .post(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `INSERT INTO "telemetryData" ("componentTelemetryID", "collectionDateTime", "telemetryValue")
          
                            VALUES ($1, $2, $3)
        
                            RETURNING *
                            `,
                            values: [req.body.componentTelemetryID, NOW(), req.body.telemetryValue]
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
        //     var insertParams = [req.body.componentTelemetryID, req.body.telemetryValue];
        //     db.query('INSERT INTO telemetryData (componentTelemetryID, collectionDateTime, telemetryValue) VALUES (?, NOW(), ?)', insertParams, (error, results, fields) => {
        //         if (error) throw error;
        //         console.log('Inserted telemetry data successfully');
        //         res.json(results);
        //     });
        // } catch (err) {
        //     console.log(err);
        //     res.json(err);
        // }
    });

router.route('/:componentTelemetryID')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {

                if (req.query.startDate) {
                    var query = {
                            text: 'SELECT * FROM "telemetryData" WHERE "componentTelemetryID" = $1 AND "collectionDateTime" BETWEEN $2 AND $3',
                            values: [req.params.componentTelemetryID, new Date(parseInt(req.query.startDate)), new Date(parseInt(req.query.endDate))]
                            }
                    var response = await client.query(query)
                    console.log(response.rows);
                    res.json(response.rows);

                } else {

                    const query = {
                        text: 'SELECT * FROM "telemetryData" WHERE "componentTelemetryID" = $1',
                        values: [req.params.componentTelemetryID]
                        }
                    const response = await client.query(query)
                    res.json(response.rows);
                }
            } catch (e) {
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     if (req.query.startDate) {
        //         console.log(req.query);
        //         var getParams = [req.params.componentTelemetryID, new Date(parseInt(req.query.startDate)), new Date(parseInt(req.query.endDate))];
        //         console.log(getParams);
        //         db.query("SELECT * FROM telemetryData WHERE componentTelemetryID = ? AND collectionDateTime BETWEEN ? AND ?", getParams, function (error, results, fields) {
        //             if (error) throw error;
        //             res.send(results);
        //         });
        //     } else {
        //         console.log('no');
        //         db.query("SELECT * FROM telemetryData WHERE componentTelemetryID = ?", req.params.componentTelemetryID, function (error, results, fields) {
        //             if (error) throw error;
        //             res.send(results);
        //         });
        //     }
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

module.exports = router;