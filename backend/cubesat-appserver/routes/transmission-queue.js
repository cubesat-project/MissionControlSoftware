const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();
var db = require('../database');

router.route('/:transmissionPassID')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        ;(async () => {
            const client = await db.connect()
            try {
                const query = {
                        text: 'SELECT * FROM "queuedTelecommands" WHERE "transmissionPassID" = $1',
                        values: [req.params.transmissionPassID]
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
        //     db.query("SELECT * FROM queuedTelecommands WHERE transmissionPassID = ?", req.params.transmissionPassID, function (error, results, fields) {
        //         if (error) throw error;
        //         res.send(results);
        //       });
        // } catch (err) {
        //     console.log(err);
        //     res.send(err);
        // }
    });

module.exports = router;