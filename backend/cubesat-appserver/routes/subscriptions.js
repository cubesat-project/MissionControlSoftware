// subscriptions handles all anomaly subscriptions

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/:userID')

    // get all subscriptions for specified userID
    .get(parseUrlencoded, parseJSON, (req, res) => {

        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `SELECT "joined.systemID", 
                                    "joined.systemName" 

                            FROM (

                                SELECT "s.systemID", 
                                       "s.systemName", 
                                       "u.userID" 

                                FROM "systems" s 

                                INNER JOIN "userAlertSubscriptions" u ON "s.systemID" = "u.systemID"

                                ) AS joined 

                            WHERE "userID" = $1`,

                        values: [req.params.userID]
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
        //     db.query(`SELECT joined.systemID, joined.systemName FROM 
                        
        //                 (SELECT s.systemID, s.systemName, u.userID FROM systems s 

        //                 INNER JOIN userAlertSubscriptions u ON s.systemID = u.systemID) 

        //             AS joined 

        //             WHERE userID = ?`, [req.params.userID], function(error, results, fields) {
        //         if (error) throw error;
        //         console.log(results);
        //         res.send(results);
        //     })
        // } catch(err) {
        //     res.send(err);
        //     console.log(err);
        // }
    })

    // create a new subscription for specified userID
    .post(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `INSERT INTO "userAlertSubscriptions" ("systemID", "userID")
          
                            VALUES ($1, $2)
        
                            RETURNING *
                            `,
                            values: [req.body.systemID, req.params.userID]
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
        //     let insertParams = [req.body.systemID, req.params.userID];
        //     db.query("INSERT INTO userAlertSubscriptions (systemID, userID) VALUES (?, ?)", insertParams, function(error, results, fields) {
        //         if (error) throw error;
        //         res.send(results);
        //     })
        // } catch (err) {
        //     res.send(err);
        //     console.log(err);
        // }
    });

router.route('/:userID.:systemID')
    // remove a subscription for specified userID
    .delete(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `DELETE FROM "userAlertSubscriptions" 

                            WHERE "systemID" = $1 AND "userID" = $2

                            RETURNING *
                          `,
                          values: [req.params.systemID, req.params.userID]
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
        //     let deleteParams = [req.params.systemID, req.params.userID];
        //     db.query("DELETE FROM userAlertSubscriptions WHERE systemID = ? AND userID = ?", deleteParams, function(error, results, fields) {
        //         if (error) throw error;
        //         res.send(results);
        //     })
        // } catch (err) {
        //     res.send(err);
        //     console.log(err);
        // }
    });

module.exports = router;