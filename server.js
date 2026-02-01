/*
 * Flowix Open Source Project
 *
 * Copyright (c) 2026
 * PT Inovixa Technologies Solution
 * Author: Tn. Dani Joest, S.M.T., C.P.M. (Full-Stack Software Engineer)
 *
 * Lisensi: MIT License
 * Repository: Open Source
 *
 * Izin diberikan kepada siapa pun untuk menggunakan, menyalin, memodifikasi,
 * dan mendistribusikan kode ini sesuai dengan ketentuan MIT License.
 *
 * Perangkat lunak ini disediakan "SEBAGAIMANA ADANYA", tanpa jaminan apa pun.
 * Penulis dan pemegang hak cipta tidak bertanggung jawab atas kerusakan atau
 * kerugian yang timbul dari penggunaan perangkat lunak ini.
 */

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');

const app = express();

/**
 * Security Middleware Configuration
 */

// Helmet: Secure HTTP headers
// CSP is disabled temporarily to allow inline scripts/styles (Tailwind, FA, custom scripts)
app.use(helmet({
    contentSecurityPolicy: false,
}));

// Rate Limiter: Basic protection against abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: "Too many requests, please try again later." }
});
app.use('/api/', limiter);

// Request Parsing & Cookie Session
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CSRF Protection
const csrfProtection = csrf({ cookie: true });

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Utility Functions
 */
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'api_key': config.api.key,
    'merchant_id': config.api.merchantId,
    'User-Agent': 'Flowix-Client-NodeJS/1.0'
});

/**
 * Application Routes
 */

// Render Checkout Page
app.get('/', csrfProtection, (req, res) => {
    res.render('index', {
        product: config.product,
        formattedPrice: new Intl.NumberFormat('id-ID').format(config.product.price),
        csrfToken: req.csrfToken()
    });
});

// API: Initiate Payment
app.post('/api/payment/create', csrfProtection, async (req, res) => {
    try {
        const reffId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 900) + 100}`;
        const payload = {
            amount: config.product.price,
            method_code: 'QRISFAST',
            fee_by_customer: false,
            reff_id: reffId
        };

        const response = await axios.post(`${config.api.baseUrl}/api/v1/deposit/create`, payload, {
            headers: getHeaders()
        });

        res.json({ 
            ...response.data, 
            newCsrfToken: req.csrfToken() 
        });

    } catch (error) {
        console.error("[Payment Error]:", error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Gagal membuat pembayaran',
            newCsrfToken: req.csrfToken()
        });
    }
});

// API: Check Transaction Status
app.post('/api/payment/status', csrfProtection, async (req, res) => {
    const { ref_id } = req.body;
    if (!ref_id) return res.status(400).json({ success: false, message: 'Ref ID Required', newCsrfToken: req.csrfToken() });

    try {
        const response = await axios.post(`${config.api.baseUrl}/api/v1/deposit/status`, 
            { ref_id }, 
            { headers: getHeaders() }
        );
        res.json({ 
            ...response.data, 
            newCsrfToken: req.csrfToken() 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal cek status', newCsrfToken: req.csrfToken() });
    }
});

// API: Cancel Transaction
app.post('/api/payment/cancel', csrfProtection, async (req, res) => {
    const { ref_id } = req.body;
    if (!ref_id) return res.status(400).json({ success: false, message: 'Ref ID Required', newCsrfToken: req.csrfToken() });

    try {
        const response = await axios.post(`${config.api.baseUrl}/api/v1/deposit/cancel`, 
            { ref_id }, 
            { headers: getHeaders() }
        );
        res.json({ 
            ...response.data, 
            newCsrfToken: req.csrfToken() 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal membatalkan', newCsrfToken: req.csrfToken() });
    }
});

// API: Secure Download Link
app.post('/api/download', csrfProtection, (req, res) => {
    res.json({ 
        download_url: config.product.downloadUrl,
        newCsrfToken: req.csrfToken()
    });
});

/**
 * Global Error Handlers
 */
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    
    // Handle invalid CSRF token
    res.status(403).json({ 
        success: false, 
        message: 'Sesi keamanan kedaluwarsa. Silakan refresh halaman.',
        forceReload: true 
    });
});

app.listen(config.app.port, () => {
    console.log(`[System] Server running on http://localhost:${config.app.port}`);
});