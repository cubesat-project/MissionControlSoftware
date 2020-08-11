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
                const query = 'SELECT * FROM "telecommandBatches"'
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
        //     db.query("SELECT * FROM telecommandBatches;", function (error, results, fields) {
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
            try {
                const query = {
                        text: 
                            `INSERT INTO "telecommandBatches" ("name")
          
                            VALUES ($1)
        
                            RETURNING *
                            `,
                            values: [req.body.name]
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
        //     var telecommandBatchName = req.body.name;

        //     // using this pattern of using ? in our query builder does the escaping for us! No need to worry about sql injection
        //     db.query('INSERT INTO telecommandBatches (name) VALUES (?)', telecommandBatchName, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

router.route('/:batchID')
    .put(parseUrlencoded, parseJSON, (req, res) => {;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `UPDATE "telecommandBatches" 
                            
                            SET "name" = $1
        
                            WHERE "batchID" = $2

                            RETURNING *
                          `,
                          values: [req.body.name, req.params.batchID]
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

        //     var updateParams = [req.body.name, req.params.batchID];

        //     db.query("UPDATE telecommandBatches SET name = ? WHERE batchID = ?;", updateParams, function (error, results, fields) {
        //         if (error) throw error;

        //         res.send(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })    
    .delete(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            await client.query('BEGIN');

            try {
                var query = {
                        text: 
                            `DELETE FROM "presetTelecommands" 

                            WHERE "batchID" = $1

                            RETURNING *
                          `,
                          values: [req.params.batchID]
                        }

                var response = await client.query(query)

                var query = {
                        text: 
                            `DELETE FROM "telecommandBatches" 

                            WHERE "batchID" = $1

                            RETURNING *
                          `,
                          values: [req.params.batchID]
                        }
                        
                var response = await client.query(query);

                await client.query('COMMIT');
                res.json(response.rows);

            } catch (e) {
                await client.query('ROLLBACK');
                console.log(e);
                res.send(e);
            } finally {
                await client.release();
            }
        })().catch(e => console.error(e.stack));

        // try {
        //     var batchToDelete =  req.params.batchID;

        //     db.query("DELETE FROM presetTelecommands WHERE batchID = ?;", batchToDelete, function (error, results, fields) {
        //         if (error) throw error;

        //         db.query("DELETE FROM telecommandBatches WHERE batchID = ?;", batchToDelete, function (error, results, fields) {
        //             if (error) throw error;
    
        //             res.send(results);
        //         });
        //     });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

module.exports = router;