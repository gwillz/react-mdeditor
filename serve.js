
const path = require("path");
const express = require('express');

const r = path.resolve.bind(null, __dirname);

const PORT = process.env.PORT || 3000;

function main() {
    const app = express();
    
    app.use(express.static(r("dist")));
    app.use(express.static(r("demo")));
    
    app.listen(PORT, () => {
        console.log(`Visit http://localhost:${PORT}/index.html`);
        console.log("Press Ctrl+C to quit.");
    });
}

if (require.main === module) main();
