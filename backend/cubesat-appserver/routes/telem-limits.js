/*
    modify-telem-limit allows admin users the ability to modify telemetryRanges
    associated with a componentTelemetry, through the PUT route.
    this of course also entails displaying all of the current ranges per 
    system/component/componentTelemetry, as per the GET route.
*/

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/')
    // PUT /telem-limits
    .put(parseUrlencoded, parseJSON, (req, res) => {

    })

    // GET /telem-limits returns all telemetry entries with their associated systems, components, and range values and units
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = 
                        `SELECT sys."systemID", 
                                sys."systemName" AS "systemName", 
                                comp."componentID", comp."name" AS "componentName",
                                telem."upperBound", 
                                telem."lowerBound", 
                                types."name" AS "unit" 

                        FROM "systems" sys

                        INNER JOIN "components" comp ON sys."systemID" = comp."systemID" 
                        INNER JOIN "componentTelemetry" telem ON comp."componentID" = telem."componentID" 
                        INNER JOIN "telemetryTypes" types ON telem."telemetryTypeID" = types."telemetryTypeID" 
                        
                        ORDER BY sys."systemID", comp."componentID"`

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

        //     db.query(`SELECT sys.systemID, sys.systemName as `systemName`, comp.componentID, comp.name as `componentName`,
        //         telem.upperBound, telem.lowerBound, types.name as `unit` FROM systems sys 
        //         INNER JOIN components comp ON sys.systemID = comp.systemID INNER JOIN componentTelemetry telem ON 
        //         comp.componentID = telem.componentID INNER JOIN telemetryTypes types ON telem.telemetryTypeID = types.telemetryTypeID 
        //         ORDER BY sys.systemID, comp.componentID`, 
        //         function (error, results) {

        //         if(error) throw error;
        //         res.json(results);

        //         })

        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    })

    
module.exports = router;
