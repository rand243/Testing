// Minimal static server for the demo app (no dependencies).
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = Number(process.env.PORT || 3000);
http.createServer((req, res) => {
  const file = path.join(__dirname, 'app', 'index.html');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`App on http://localhost:${port}`));
