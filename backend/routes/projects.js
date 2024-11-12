const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/', (req, res) => {
    const { project_name, domain_name, student_id } = req.body;
    
    db.query(
        'INSERT INTO projects (project_name, domain_name, student_id) VALUES (?, ?, ?)',
        [project_name, domain_name, student_id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json({
                    message: "Project added successfully!",
                    project_id: result.insertId  // MySQL provides the auto-generated ID
                });
            }
        }
    );
});

router.get('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    
    db.query(
        'SELECT * FROM projects WHERE student_id = ?',
        [studentId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json(result);
            }
        }
    );
});


module.exports = router;