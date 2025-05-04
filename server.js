require('dotenv').config();

const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const url = require('url');

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true, followRedirects: true });

// Настройка логирования с помощью winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'proxy.log' })
    ]
});

// Middleware для CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Proxied-By']
}));

// Ограничение количества запросов (100 запросов за 15 минут с одного IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Логирование всех входящих запросов
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url} from ${req.ip}`);
    next();
});

// Настройка заголовков в ответах прокси
proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : '*');
    res.setHeader('X-Proxied-By', 'CORS-Proxy-Server');
});

// Валидация URL
const isValidUrl = (targetUrl) => {
    try {
        const parsedUrl = url.parse(targetUrl);
        if (!parsedUrl.protocol || !parsedUrl.host || !['http:', 'https:'].includes(parsedUrl.protocol)) {
            return false;
        }
        // Запрет на локальные адреса для защиты от SSRF
        const host = parsedUrl.hostname.toLowerCase();
        if (host === 'localhost' || host.startsWith('127.') || host.startsWith('192.168.') || host === '0.0.0.0') {
            return false;
        }
        // Проверка формата URL
        const urlRegex = /^(https?:\/\/)([\w.-]+)(\.[a-z]{2,})(:\d{1,5})?(\/.*)?$/i;
        return urlRegex.test(targetUrl);
    } catch {
        return false;
    }
};

// Маршрут для проксирования
app.all('/url', (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        logger.warn(`Missing "url" parameter from ${req.ip}`);
        return res.status(400).json({ error: 'Missing "url" parameter' });
    }

    if (!isValidUrl(targetUrl)) {
        logger.warn(`Invalid URL provided: ${targetUrl} from ${req.ip}`);
        return res.status(400).json({ error: 'Invalid URL. Must include valid http/https protocol and host.' });
    }

    logger.info(`Proxying ${req.method} request to: ${targetUrl}`);

    proxy.web(req, res, { target: targetUrl }, (err) => {
        logger.error(`Proxy error for ${targetUrl}: ${err.message}`);
        res.status(500).json({ error: 'Proxy error occurred', details: err.message });
    });
});

// Обработка ошибок прокси
proxy.on('error', (err, req, res) => {
    logger.error(`Proxy error for ${req.query.url || 'unknown'}: ${err.message}`);
    res.status(500).json({ error: 'Proxy error occurred', details: err.message });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`CORS Proxy Server is running on port ${PORT}`);
});

// Обработка непойманных исключений
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
});