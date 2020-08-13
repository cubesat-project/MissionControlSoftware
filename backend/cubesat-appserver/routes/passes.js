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
                const query = 
                            `SELECT passes.*, 
                                    COALESCE("passExecutedTelecommandsCount", 0) AS "numberOfTelecommandsToBeExecuted", 
                                    COALESCE("passTransmittedTelecommandsCount", 0) AS "numberOfTelecommandsToBeTransmitted" 
                                    
                            FROM "passes"

                            LEFT JOIN (

                                SELECT "executionPassID", 
                                        Count(*) AS "passExecutedTelecommandsCount" 

                                FROM "queuedTelecommands" GROUP BY "executionPassID"

                                ) AS extc ON passes."passID" = extc."executionPassID"

                            LEFT JOIN (

                                SELECT "transmissionPassID", 
                                        Count(*) AS "passTransmittedTelecommandsCount" 

                                FROM "queuedTelecommands" GROUP BY "transmissionPassID"

                                ) AS ttc ON passes."passID" = ttc."transmissionPassID" ORDER BY "passID"`

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
        //     db.query(
        //         `Select passes.*, COALESCE(passExecutedTelecommandsCount, 0) AS numberOfTelecommandsToBeExecuted, 
        //         COALESCE(passTransmittedTelecommandsCount, 0) AS numberOfTelecommandsToBeTransmitted FROM passes 
        //         LEFT JOIN (
        //             SELECT executionPassID, Count(*) AS passExecutedTelecommandsCount FROM queuedTelecommands GROUP BY executionPassID
        //             ) 

        //             AS executedTelecommandsCount on passes.passID = executedTelecommandsCount.executionPassID 

        //         LEFT JOIN (
        //             SELECT transmissionPassID, Count(*) AS passTransmittedTelecommandsCount FROM queuedTelecommands GROUP BY transmissionPassID
        //             ) 

        //         AS transmittedTelecommandsCount ON passes.passID = transmittedTelecommandsCount.transmissionPassID ORDER BY passID;`, function (error, results, fields) {
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
                            `INSERT INTO "passes" ("passHasOccurred", "estimatedPassDateTime", "availablePower", "availableBandwidth")
          
                            VALUES ($1, $2, $3, $4)
        
                            RETURNING *
                            `,
                            values: [req.body.passHasOccurred, req.body.estimatedPassDateTime, req.body.availablePower, req.body.availableBandwidth]
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
        //     var insertParameters = [req.body.passHasOccurred, req.body.estimatedPassDateTime, req.body.availablePower, req.body.availableBandwidth];

        //     // using this pattern of using ? in our query builder does the escaping for us! No need to worry about sql injection
        //     db.query('INSERT INTO passes (passHasOccurred, estimatedPassDateTime, availablePower, availableBandwidth) VALUES (?, ?, ?, ?)', insertParameters, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

router.route('/:ID')
    .put(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 
                            `UPDATE "passes" 
                            
                            SET "passHasOccurred" = $1,
                                "estimatedPassDateTime" = $2,
        
                            WHERE "telecommandID" = $3

                            RETURNING *
                          `,
                          values: [req.body.passHasOccurred, req.body.estimatedPassDateTime, req.params.ID]
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

        //     var passToUpdate = req.params.ID;
        //     var updateParameters = [req.body.passHasOccurred, req.body.estimatedPassDateTime, passToUpdate];

        //     db.query('UPDATE passes SET passHasOccurred = ?, estimatedPassDateTime = ? WHERE telecommandID = ?', updateParameters, function (error, results, fields) {
        //         if (error) throw error;

        //         res.json(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

router.route('/transmission-sum')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = 
                    `SELECT passes."passID", 
                            SUM("bandwidthUsage") AS "sumBandwidth", 
                            SUM("powerConsumption") AS "sumPower"  
                
                    FROM passes 

                    RIGHT JOIN "queuedTelecommands" AS qtc ON passes."passID" = qtc."transmissionPassID"

                    LEFT JOIN "telecommands" AS tc ON qtc."telecommandID" = tc."telecommandID" 

                    GROUP BY passes."passID"`

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
        //     db.query(`SELECT pass.passID, SUM(bandwidthUsage) as sumBandwidth, SUM(powerConsumption) as sumPower ' 
        //         'FROM cubesat.passes as pass ' 
        //         'RIGHT JOIN cubesat.queuedTelecommands as qtc ' 
        //         'ON pass.passID = qtc.transmissionPassID ' 
        //         'LEFT JOIN cubesat.telecommands as tc ' 
        //         'ON qtc.telecommandID = tc.telecommandID ' 
        //         'GROUP BY pass.passID;`, function (error, results, fields){
        //         if (error) throw error;
        //         if (!results) {
        //             console.log(results);
        //             res.send({error:'no results'});
        //         }
        //         res.json(results);
        //     })
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

router.route('/execution-sum')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = 
                    `SELECT passes."passID", 
                            SUM("bandwidthUsage") AS "sumBandwidth", 
                            SUM("powerConsumption") AS "sumPower" 
                    
                    FROM passes  

                    RIGHT JOIN "queuedTelecommands" AS qtc ON passes."passID" = qtc."executionPassID"  
                    
                    LEFT JOIN "telecommands" AS tc  ON qtc."telecommandID" = tc."telecommandID" 

                    GROUP BY passes."passID"`
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
        //     db.query(`SELECT pass.passID, SUM(bandwidthUsage) as sumBandwidth, SUM(powerConsumption) as sumPower ' 
        //         'FROM cubesat.passes as pass ' 
        //         'RIGHT JOIN cubesat.queuedTelecommands as qtc ' 
        //         'ON pass.passID = qtc.executionPassID ' 
        //         'LEFT JOIN cubesat.telecommands as tc ' 
        //         'ON qtc.telecommandID = tc.telecommandID ' 
        //         'GROUP BY pass.passID;`, function (error, results, fields){
        //         if (error) throw error;
        //         if (!results) {
        //             console.log(results);
        //             res.send({error:'no results'});
        //         }
        //         res.json(results);
        //     })
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

module.exports = router;