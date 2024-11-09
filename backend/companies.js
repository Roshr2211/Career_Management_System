const express = require('express');
// const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'roshr1331',
    database: 'career_manage'
});

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});

// Create companies table if it doesn't exist
db.query(`
    CREATE TABLE IF NOT EXISTS COMPANIES (
        company_id VARCHAR(50) PRIMARY KEY,
        company_name VARCHAR(100) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        company_description TEXT,
        image_path VARCHAR(255)
    )
`, (err) => {
    if (err) {
        console.error('Error creating companies table:', err);
    } else {
        console.log('Companies table checked/created successfully');
    }
});

// Route to get all companies
app.get('/companies', (req, res) => {
    db.query('SELECT * FROM COMPANIES', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching companies' });
        }
        return res.json(result);
    });
});

// Route to get a specific company
app.get('/companies/:id', (req, res) => {
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

// Route to add a new company
app.post('/companies', upload.single('companyImage'), (req, res) => {
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

// Route to update a company
app.put('/companies/:id', upload.single('companyImage'), (req, res) => {
    const companyId = req.params.id;
    const { companyName, industry, companyDescription } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // First, get the current company data to check if we need to delete an old image
    db.query('SELECT image_path FROM COMPANIES WHERE company_id = ?', [companyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching company' });
        }

        // If there's a new image and an old image exists, delete the old one
        if (imagePath && result[0]?.image_path) {
            const oldImagePath = path.join(__dirname, result[0].image_path);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update the company information
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

// Route to delete a company
app.delete('/companies/:id', (req, res) => {
    const companyId = req.params.id;

    // First, get the company data to delete the image if it exists
    db.query('SELECT image_path FROM COMPANIES WHERE company_id = ?', [companyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching company' });
        }

        // If an image exists, delete it
        if (result[0]?.image_path) {
            const imagePath = path.join(__dirname, result[0].image_path);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete the company record
        db.query('DELETE FROM COMPANIES WHERE company_id = ?', [companyId], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error(deleteErr);
                return res.status(500).json({ error: 'Error deleting company' });
            }
            res.json({ message: 'Company deleted successfully' });
        });
    });
});

