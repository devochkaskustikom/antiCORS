# antiCORS - CORS Proxy Server

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14.0.0-green.svg)
![GitHub stars](https://img.shields.io/github/stars/devochkaskustikom/antiCORS.svg?style=social)

## 📖 Description

**antiCORS** is a lightweight and reliable proxy server built with **Node.js** and **Express.js** to bypass **Cross-Origin Resource Sharing (CORS)** restrictions during web development. It forwards HTTP/HTTPS requests to a specified URL and returns responses with appropriate CORS headers, enabling client-side applications to access resources from servers that do not natively support CORS.

> ⚠️ **Note**: This project is intended for **development purposes only**. For production environments, implement additional security measures such as origin restrictions, authentication, and HTTPS.

## ✨ Features

- Proxies requests to any HTTP/HTTPS URL.
- Supports all HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, etc.).
- Automatically handles CORS preflight (`OPTIONS`) requests.
- Adds `Access-Control-Allow-Origin` headers for cross-origin access.
- Rate limiting to prevent abuse (100 requests per 15 minutes per IP).
- Structured logging with **Winston** for debugging and monitoring.
- Basic SSRF protection by blocking local network addresses.
- Configurable via environment variables (e.g., allowed origins, port).

## 🚀 Installation

### Prerequisites

- **Node.js** (version 14.0.0 or higher)
- **npm**

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/devochkaskustikom/antiCORS.git
   cd antiCORS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root and configure it:
   ```env
   # Port to run the server (default: 3000)
   PORT=3000

   # Comma-separated list of allowed origins for CORS
   # Example: https://yourdomain.com,https://anotherdomain.com
   # Use '*' to allow all origins (development only)
   ALLOWED_ORIGINS=*
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **For development with auto-reload**:
   ```bash
   npm run dev
   ```

The server runs on **port 3000** by default. To use a different port, set the `PORT` environment variable:
```bash
PORT=8080 npm start
```

## 🛠️ Usage

Send requests to the proxy server with the target URL as a query parameter (`url`). Ensure the target URL is **URL-encoded**.

### Example Request
```
http://localhost:3000/url?url=https%3A%2F%2Fapi.example.com%2Fdata
```

### Using `fetch` (GET Request)
```javascript
fetch('http://localhost:3000/url?url=' + encodeURIComponent('https://api.example.com/data'))
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

### Using `fetch` (POST Request)
```javascript
fetch('http://localhost:3000/url?url=' + encodeURIComponent('https://api.example.com/submit'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root to configure the server:

| Variable          | Description                                                                 | Default        |
|-------------------|-----------------------------------------------------------------------------|----------------|
| `PORT`            | Port to run the server.                                                     | `3000`         |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins (e.g., `https://example.com`).      | `*` (all)      |

### Example `.env`
```env
PORT=3000
ALLOWED_ORIGINS=https://example.com
```

### Security (Production)

- Restrict `ALLOWED_ORIGINS` to specific domains.
- Deploy behind an HTTPS reverse proxy (e.g., **Nginx**) or use the `https` module.
- Consider adding API key authentication.
- Whitelist allowed target domains to mitigate SSRF risks.

## 📦 Dependencies

| Package             | Purpose                                             |
|---------------------|-----------------------------------------------------|
| `express`           | Web framework for handling HTTP requests.           |
| `http-proxy`        | Proxy server for forwarding requests.               |
| `cors`              | Middleware for CORS handling.                       |
| `express-rate-limit`| Rate limiting to prevent abuse.                     |
| `winston`           | Logging library for structured logs.                |
| `dotenv`            | Loads environment variables from `.env` file.       |
| `nodemon`           | Auto-reloads server during development (dev).       |

Install dependencies:
```bash
npm install
```

## 📜 Logging

Logs are written to:
- **Console**: For real-time debugging.
- **`proxy.log` file**: For persistent records.

Log entries include timestamps, request details, and errors in **JSON format**.

## 🧪 Testing

### Valid GET Request
```
http://localhost:3000/url?url=https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%2F1
```
**Expected**: JSON response from the target API.

### Valid POST Request
Use the `fetch` POST example above.

### Invalid URL
```
http://localhost:3000/url?url=invalid-url
```
**Expected**: `{ "error": "Invalid URL. Must include valid http/https protocol and host." }`

### Local Address (Blocked)
```
http://localhost:3000/url?url=http%3A%2F%2Flocalhost%3A8080
```
**Expected**: `{ "error": "Invalid URL. Must include valid http/https protocol and host." }`

## 🌐 Production Recommendations

- Use **HTTPS** to secure data in transit.
- Restrict `ALLOWED_ORIGINS` to trusted domains.
- Implement a whitelist for target URLs.
- Monitor logs for unusual activity.
- Deploy with a process manager like **PM2** for reliability.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add your feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

Report bugs or suggest features by opening an [issue](https://github.com/devochkaskustikom/antiCORS/issues).

## 👩‍💻 Author

**девочка с кустиком**

Star the repository if you find it useful! ⭐  
Happy proxying! 🚀
