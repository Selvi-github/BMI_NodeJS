const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file when the root URL is accessed
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle the POST request from the form
app.post("/bmicalculator", (req, res) => {
    // Extract name, height, and weight from the request body
    const name = req.body.Name;
    const height = parseFloat(req.body.Height);
    const weight = parseFloat(req.body.Weight);

    // Validate inputs
    if (!name || isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        return res.send("<h3>Invalid input. Please provide valid name, height, and weight.</h3><br><a href='/'>Go back</a>");
    }

    // Calculate BMI
    const bmi = weight / (height * height);
    
    // Determine BMI category
    let category = "";
    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal Weight";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
    } else {
        category = "Obese";
    }

    // Define health guidelines based on category
    let guidelines = "";
    if (category === "Underweight") {
        guidelines = "<ul><li>Consider eating more frequently.</li><li>Choose nutrient-rich foods like whole grains, fruits, vegetables, dairy products, nuts, and seeds.</li><li>Try smoothies and shakes for extra calories.</li><li>Consult a healthcare provider or a dietitian for a personalized plan.</li></ul>";
    } else if (category === "Normal Weight") {
        guidelines = "<ul><li>Maintain your current healthy lifestyle!</li><li>Continue eating a balanced diet rich in fruits, vegetables, and lean proteins.</li><li>Engage in regular physical activity (at least 150 minutes a week).</li><li>Stay hydrated and get enough sleep.</li></ul>";
    } else if (category === "Overweight") {
        guidelines = "<ul><li>Focus on a balanced, calorie-controlled diet.</li><li>Increase your physical activity (aiming for 30 minutes a day, most days of the week).</li><li>Monitor portion sizes.</li><li>Consider consulting a healthcare provider for a sustainable weight loss plan.</li></ul>";
    } else {
        guidelines = "<ul><li>It is highly recommended to consult a healthcare provider for professional guidance.</li><li>Focus on making gradual, sustainable lifestyle changes rather than quick fixes.</li><li>Incorporate regular, manageable physical activity into your routine.</li><li>Consider seeking support from a dietitian or a weight management program.</li></ul>";
    }

    // Generate response HTML with embedded styles for a better look
    const responseHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Result & Guidelines</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    color: #333;
                }
                .result-container {
                    background: rgba(255, 255, 255, 0.98);
                    padding: 45px 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    max-width: 500px;
                    width: 100%;
                    border-top: 5px solid #3b82f6;
                }
                .header-section {
                    text-align: center;
                    margin-bottom: 30px;
                }
                h2 { color: #0f172a; margin-top: 0; font-size: 26px; letter-spacing: -0.5px;}
                p { color: #475569; font-weight: 500; }
                .bmi-value {
                    font-size: 42px;
                    font-weight: 700;
                    color: #3b82f6;
                    margin: 15px 0;
                    letter-spacing: -1px;
                }
                .category {
                    font-size: 18px;
                    font-weight: 600;
                    padding: 8px 16px;
                    border-radius: 6px;
                    display: inline-block;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .underweight { background-color: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
                .normal { background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
                .overweight { background-color: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; }
                .obese { background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
                
                .guidelines-section {
                    background: #f8fafc;
                    padding: 24px;
                    border-radius: 8px;
                    border-left: 4px solid #3b82f6;
                    margin-bottom: 30px;
                    border-top: 1px solid #e2e8f0;
                    border-right: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .guidelines-section h3 {
                    margin-top: 0;
                    color: #1e293b;
                    font-size: 18px;
                    margin-bottom: 15px;
                }
                .guidelines-section ul {
                    margin: 0;
                    padding-left: 20px;
                    color: #475569;
                    font-size: 15px;
                    line-height: 1.7;
                }
                .guidelines-section li { margin-bottom: 10px; }
                
                .action-section {
                    text-align: center;
                }
                a.btn {
                    display: inline-block;
                    padding: 14px 28px;
                    background: #2563eb;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
                    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
                    letter-spacing: 0.5px;
                    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
                }
                a.btn:hover { 
                    background: #1d4ed8;
                    box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
                }
                a.btn:active {
                    transform: scale(0.98);
                }
            </style>
        </head>
        <body>
            <div class="result-container">
                <div class="header-section">
                    <h2>Hello, ${name}!</h2>
                    <p>Your Body Mass Index (BMI) is:</p>
                    <div class="bmi-value">${bmi.toFixed(2)}</div>
                    <div class="category ${category.split(' ')[0].toLowerCase()}">${category}</div>
                </div>
                
                <div class="guidelines-section">
                    <h3>Health Guidelines & Awareness</h3>
                    ${guidelines}
                </div>
                
                <div class="action-section">
                <a href="/" class="btn">Calculate Again</a>
            </div>
        </body>
        </html>
    `;

    res.send(responseHtml);
});

// Start the server
app.listen(port, () => {
    console.log(`BMI Calculator app listening at http://localhost:${port}`);
});
