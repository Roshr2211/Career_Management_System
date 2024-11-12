const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/', (req, res) => {
    const { 
        student_id, gpa, credits_completed, programming_concepts_percentage,
        algorithms_concepts_percentage, software_engineering_percentage,
        computer_network_percentage, electronic_subjects_percentage,
        computer_architecture_percentage, mathematics_percentage,
        communication_skills_percentage, operating_systems_percentage
    } = req.body;

    db.query(
        `INSERT INTO ACADEMIC_PERFORMANCE 
        (student_id, gpa, credits_completed, programming_concepts_percentage,
         algorithms_concepts_percentage, software_engineering_percentage,
         computer_network_percentage, electronic_subjects_percentage,
         computer_architecture_percentage, mathematics_percentage,
         communication_skills_percentage, operating_systems_percentage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [student_id, gpa, credits_completed, programming_concepts_percentage,
         algorithms_concepts_percentage, software_engineering_percentage,
         computer_network_percentage, electronic_subjects_percentage,
         computer_architecture_percentage, mathematics_percentage,
         communication_skills_percentage, operating_systems_percentage],
         (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).send("Error adding academic performance. Please check server logs.");
            } else {
                res.send("Academic performance added successfully!");
            }
        }
    );
});

module.exports = router;