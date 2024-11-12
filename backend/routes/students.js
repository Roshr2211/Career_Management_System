const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    db.query('SELECT * FROM STUDENTS', (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.send(result);
    });
});

router.post('/', (req, res) => {
    const { student_id, student_name, email, password, gender } = req.body;
    db.query(
        'INSERT INTO STUDENTS (student_id, student_name, email, password, gender) VALUES (?, ?, ?, ?, ?)',
        [student_id, student_name, email, password, gender],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send("Student added successfully!");
            }
        }
    );
});

module.exports = router;