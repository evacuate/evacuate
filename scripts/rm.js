const fs = require('fs');
const path = require('path');
const distPath = path.resolve(__dirname, '../dist');
fs.existsSync(distPath);
