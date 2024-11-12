const express = require('express');
const router = express.Router();
const db = require('../config/database');

// router.get('/', (req, res) => {
//     db.query('SELECT * FROM SKILLS', (err, result) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send(err);
//         }
//         return res.send(result);
//     });
// });

router.post('/', (req, res) => {
    const { skill_name, proficiency_level, certifications, student_id } = req.body;
    
    db.query(
        'INSERT INTO skills (skill_name, proficiency_level, certifications, student_id) VALUES (?, ?, ?, ?)',
        [skill_name, proficiency_level, certifications, student_id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json({
                    message: "Skill added successfully!",
                    skill_id: result.insertId  // MySQL provides the auto-generated ID
                });
            }
        }
    );
});


router.get('/student/:studentId/skills', (req, res) => {
    const studentId = req.params.studentId;
    
    db.query(
        'SELECT * FROM skills WHERE student_id = ?',
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