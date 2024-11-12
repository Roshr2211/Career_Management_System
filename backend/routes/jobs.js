const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    const query = `
        SELECT j.*, c.company_name 
        FROM JOB_LISTINGS j 
        JOIN COMPANIES c ON j.company_id = c.company_id
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            return res.status(500).json({ error: 'Failed to fetch jobs' });
        }
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const jobId = req.params.id;
    
    const query = `
        SELECT j.*, c.company_name 
        FROM JOB_LISTINGS j 
        JOIN COMPANIES c ON j.company_id = c.company_id 
        WHERE j.job_id = ?
    `;
    
    db.query(query, [jobId], (err, results) => {
        if (err) {
            console.error('Error fetching job:', err);
            return res.status(500).json({ error: 'Failed to fetch job details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(results[0]);
    });
});

router.post('/', (req, res) => {
    const { job_title, job_description, expected_salary, company_id } = req.body;

    if (!job_title || !job_description || !expected_salary || !company_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('SELECT company_id FROM COMPANIES WHERE company_id = ?', [company_id], (err, results) => {
        if (err) {
            console.error('Error checking company:', err);
            return res.status(500).json({ error: 'Failed to verify company' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid company_id' });
        }

        const insertQuery = `
            INSERT INTO JOB_LISTINGS 
            (job_title, job_description, expected_salary, company_id) 
            VALUES (?, ?, ?, ?)
        `;

        db.query(insertQuery, 
            [job_title, job_description, expected_salary, company_id], 
            (err, result) => {
                if (err) {
                    console.error('Error creating job:', err);
                    return res.status(500).json({ error: 'Failed to create job listing' });
                }

                const selectQuery = `
                    SELECT j.*, c.company_name 
                    FROM JOB_LISTINGS j 
                    JOIN COMPANIES c ON j.company_id = c.company_id 
                    WHERE j.job_id = ?
                `;

                db.query(selectQuery, [result.insertId], (err, jobs) => {
                    if (err) {
                        console.error('Error fetching created job:', err);
                        return res.status(500).json({ 
                            message: 'Job created but failed to fetch details',
                            job_id: result.insertId 
                        });
                    }
                    res.status(201).json({
                        message: 'Job listing created successfully',
                        job: jobs[0]
                    });
                });
            }
        );
    });
});

router.put('/:id', (req, res) => {
    const jobId = req.params.id;
    const { job_title, job_description, expected_salary, company_id } = req.body;

    db.query('SELECT job_id FROM JOB_LISTINGS WHERE job_id = ?', [jobId], (err, results) => {
        if (err) {
            console.error('Error checking job:', err);
            return res.status(500).json({ error: 'Failed to verify job' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (company_id) {
            db.query('SELECT company_id FROM COMPANIES WHERE company_id = ?', [company_id], (err, results) => {
                if (err) {
                    console.error('Error checking company:', err);
                    return res.status(500).json({ error: 'Failed to verify company' });
                }

                if (results.length === 0) {
                    return res.status(400).json({ error: 'Invalid company_id' });
                }

                updateJob();
            });
        } else {
            updateJob();
        }

        function updateJob() {
            const updateQuery = `
                UPDATE JOB_LISTINGS 
                SET job_title = ?, 
                    job_description = ?, 
                    expected_salary = ?, 
                    company_id = ?
                WHERE job_id = ?
            `;

            db.query(updateQuery,
                [job_title, job_description, expected_salary, company_id, jobId],
                (err, result) => {
                    if (err) {
                        console.error('Error updating job:', err);
                        return res.status(500).json({ error: 'Failed to update job listing' });
                    }

                    res.json({
                        message: 'Job updated successfully',
                        job_id: jobId
                    });
                }
            );
        }
    });
});

router.delete('/:id', (req, res) => {
    const jobId = req.params.id;

    db.query('SELECT job_id FROM JOB_LISTINGS WHERE job_id = ?', [jobId], (err, results) => {
        if (err) {
            console.error('Error checking job:', err);
            return res.status(500).json({ error: 'Failed to verify job' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        db.query('DELETE FROM JOB_LISTINGS WHERE job_id = ?', [jobId], (err, result) => {
            if (err) {
                console.error('Error deleting job:', err);
                return res.status(500).json({ error: 'Failed to delete job listing' });
            }

            res.json({
                message: 'Job deleted successfully',
                job_id: jobId
            });
        });
    });
});

module.exports = router;