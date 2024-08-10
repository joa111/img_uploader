const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host : "localhost",    
    user: "root",
    password: "",
    database: "img_app"
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database.');
  });

  app.post('/signup', (req, res) => {
    // Corrected SQL syntax: column names should not be quoted with single quotes
    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    
    // Values to be inserted into the database
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];

    // Execute the query with the values provided by the user
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error occurred during the query execution:', err);
            return res.status(500).json("Error occurred while creating the user");
        }
        return res.status(201).json("User created successfully");
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email= ? AND password = ? ";
    db.query(sql, [req.body.email,req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0){
            return res.json("Success");
        }
        else {
            return res.json("Failed");
        }
    });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });
  
// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    const { title } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(400).json('No file uploaded.');
    }

    // Save the image details to the database (adjust as needed)
    const sql = "INSERT INTO images (title, imagePath) VALUES (?, ?)";
    const values = [title, image.path];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error saving image details:', err);
            return res.status(500).json('Error saving image details.');
        }
        return res.status(200).json('Image uploaded successfully.');
    });
});


app.listen(8081, () => {
    console.log(`Server listening at http://localhost:8081`);
  });
  