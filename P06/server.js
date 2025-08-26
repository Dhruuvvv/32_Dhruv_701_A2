const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Welcome to the Weather API! ');
});

app.get('/weather', async (req, res) => {
    const city = req.query.city || 'Surat';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        console.error('❌ API key is missing');
        return res.status(500).json({ error: 'API key not configured' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);

        if (response.data.cod !== 200) {
            console.warn(`⚠️ City not found: ${city}`);
            return res.status(404).json({ error: 'City not found' });
        }

        res.json(response.data);
    } catch (error) {
        console.error('❌ Error fetching weather:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});