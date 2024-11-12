const express = require('express');
const router = express.Router();
const db = require('../config/database');
const upload = require('../config/multer');
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
    db.query('SELECT * FROM COMPANIES', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching companies' });
        }
        return res.json(result);
    });
});

router.get('/:id', (req, res) => {
    const companyId = req.params.id;
    db.query('SELECT * FROM COMPANIES WHERE company_id = ?', [companyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching company' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        return res.json(result[0]);
    });
});

router.post('/', upload.single('companyImage'), (req, res) => {
    const { companyId, companyName, industry, companyDescription } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    db.query(
        'INSERT INTO COMPANIES (company_id, company_name, industry, company_description, image_path) VALUES (?, ?, ?, ?, ?)',
        [companyId, companyName, industry, companyDescription, imagePath],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error adding company' });
            }
            res.json({ message: 'Company added successfully', imagePath });
        }
    );
});

router.put('/:id', upload.single('companyImage'), (req, res) => {
    const companyId = req.params.id;
    const { companyName, industry, companyDescription } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    db.query('SELECT image_path FROM COMPANIES WHERE company_id = ?', [companyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching company' });
        }

        if (imagePath && result[0]?.image_path) {
            const oldImagePath = path.join(__dirname, '..', result[0].image_path);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updateQuery = imagePath 
            ? 'UPDATE COMPANIES SET company_name = ?, industry = ?, company_description = ?, image_path = ? WHERE company_id = ?'
            : 'UPDATE COMPANIES SET company_name = ?, industry = ?, company_description = ? WHERE company_id = ?';
        
        const updateValues = imagePath 
            ? [companyName, industry, companyDescription, imagePath, companyId]
            : [companyName, industry, companyDescription, companyId];

        db.query(updateQuery, updateValues, (updateErr, updateResult) => {
            if (updateErr) {
                console.error(updateErr);
                return res.status(500).json({ error: 'Error updating company' });
            }
            res.json({ message: 'Company updated successfully', imagePath });
        });
    });
});

router.delete('/:id', (req, res) => {
    const companyId = req.params.id;

    db.query('SELECT image_path FROM COMPANIES WHERE company_id = ?', [companyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching company' });
        }

        if (result[0]?.image_path) {
            const imagePath = path.join(__dirname, '..', result[0].image_path);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        db.query('DELETE FROM COMPANIES WHERE company_id = ?', [companyId], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error(deleteErr);
                return res.status(500).json({ error: 'Error deleting company' });
            }
            res.json({ message: 'Company deleted successfully' });
        });
    });
});

module.exports = router;