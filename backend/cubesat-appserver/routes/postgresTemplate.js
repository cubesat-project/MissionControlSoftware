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

                const query = {
                        text: 'SELECT * FROM table where column = $1',
                        values: [req.query.param],
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

    })
    .post(parseUrlencoded, parseJSON, (req, res) => {

      ;(async () => {

            const client = await db.connect()

            try {

                const query = {
                        text: 
                          `INSERT INTO table (column1, column2, column3)
          
                             VALUES ($1, $2, $3)
        
                            RETURNING *
                          `,
                          values: [req.body.param1, req.body.param2, req.body.param3],
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
    });

module.exports = router;
