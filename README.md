antiCORS - CORS Proxy Server


📖 Description
antiCORS is a lightweight, reliable proxy server built with Node.js and Express.js to bypass Cross-Origin Resource Sharing (CORS) restrictions during web development. It forwards HTTP/HTTPS requests to a specified URL and returns responses with appropriate CORS headers, enabling client-side applications to access resources from servers that do not natively support CORS.

⚠️ Note: This project is intended for development purposes. For production environments, implement additional security measures such as origin restrictions, authentication, and HTTPS.


✨ Features

Proxies requests to any HTTP/HTTPS URL.
Supports all HTTP methods (GET, POST, PUT, DELETE, etc.).
Automatically handles CORS preflight (OPTIONS) requests.
Adds Access-Control-Allow-Origin headers for cross-origin access.
Rate limiting to prevent abuse (100 requests per 15 minutes per IP).
Structured logging with winston for debugging and monitoring.
Basic SSRF protection by blocking local network addresses.
Configurable via environment variables (e.g., allowed origins, port).


🚀 Installation
Prerequisites

Node.js (version 14.0.0 or higher)
npm

Steps

Clone the repository:
git clone https://github.com/devochkaskustikom/antiCORS.git
cd antiCORS


Install dependencies:
npm install


Create a .env file in the project root and configure it:
# Порт, на котором будет работать сервер (по умолчанию: 3000)
PORT=3000

# Список разрешенных источников для CORS (через запятую)
# Пример: https://yourdomain.com, https://anotherdomain.com
# Используйте '*' для разрешения всех источников (только для разработки)
ALLOWED_ORIGINS=*


Start the server:
npm start


For development with auto-reload:
npm run dev




The server runs on port 3000 by default. To use a different port, set the PORT environment variable:
PORT=8080 npm start



🛠️ Usage
Send requests to the proxy server with the target URL as a query parameter (url). Ensure the target URL is URL-encoded.
Example Request
http://localhost:3000/url?url=https%3A%2F%2Fapi.example.com%2Fdata

Using fetch (GET Request)
fetch('http://localhost:3000/url?url=' + encodeURIComponent('https://api.example.com/data'))
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

Using fetch (POST Request)
fetch('http://localhost:3000/url?url=' + encodeURIComponent('https://api.example.com/submit'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));


⚙️ Configuration
Environment Variables
Create a .env file in the project root to configure the server:



Variable
Description
Default



PORT
Port to run the server.
3000


ALLOWED_ORIGINS
Comma-separated list of allowed origins (e.g., https://example.com).
* (all)


Example .env
PORT=3000
ALLOWED_ORIGINS=https://example.com

Security (Production)

Restrict ALLOWED_ORIGINS to specific domains.
Deploy behind an HTTPS reverse proxy (e.g., Nginx) or use the https module.
Consider adding API key authentication.
Whitelist allowed target domains to mitigate SSRF risks.


📦 Dependencies



Package
Purpose



express
Web framework for handling HTTP requests.


http-proxy
Proxy server for forwarding requests.


cors
Middleware for CORS handling.


express-rate-limit
Rate limiting to prevent abuse.


winston
Logging library for structured logs.


dotenv
Loads environment variables from .env file.


nodemon
Auto-reloads server during development (dev).


Install dependencies:
npm install


📜 Logging
Logs are written to:

Console: For real-time debugging.
proxy.log file: For persistent records.

Log entries include timestamps, request details, and errors in JSON format.

🧪 Testing
Valid GET Request
http://localhost:3000/url?url=https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%2F1

Expected: JSON response from the target API.
Valid POST Request
Use the fetch POST example above.
Invalid URL
http://localhost:3000/url?url=invalid-url

Expected: { "error": "Invalid URL. Must include valid http/https protocol and host." }
Local Address (Blocked)
http://localhost:3000/url?url=http%3A%2F%2Flocalhost%3A8080

Expected: { "error": "Invalid URL. Must include valid http/https protocol and host." }

🌐 Production Recommendations

Use HTTPS to secure data in transit.
Restrict ALLOWED_ORIGINS to trusted domains.
Implement a whitelist for target URLs.
Monitor logs for unusual activity.
Deploy with a process manager like pm2 for reliability.


📄 License
This project is licensed under the MIT License.

🤝 Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch:git checkout -b feature/your-feature


Commit your changes:git commit -m 'Add your feature'


Push to the branch:git push origin feature/your-feature


Open a pull request.

Report bugs or suggest features by opening an issue.

👩‍💻 Author
девочка с кустиком
Star the repository if you find it useful! ⭐
Happy proxying! 🚀
