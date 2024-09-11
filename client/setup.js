const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Helper to execute shell commands
const runCmd = (cmd) => {
    try {
        execSync(cmd, { stdio: "inherit" });
    } catch (e) {
        console.error(`Failed to execute: ${cmd}`, e);
        process.exit(1);
    }
};

// Read dependencies and folder structure
const dependencies = require("./dependencies.json");
const folderStructure = require("./folder-structure.json");

// Create React app and set up
const setupReactClient = (clientFolder) => {
    console.log("Creating React client...");

    // Change to the client directory
    
    process.chdir(clientFolder);

    // Create React app and move to that directory
    runCmd("npm create vite@latest . -- --template react-ts");
    runCmd("npm install -D tailwindcss postcss autoprefixer");
    runCmd("npx tailwindcss init -p");

    // Create paths for Tailwind config and CSS file
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
    const cssFilePath = path.join(process.cwd(), 'src', 'index.css');

    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
    module.exports = {
        content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
            extend: {},
        },
        plugins: [],
    }
    `;
    fs.writeFileSync(tailwindConfigPath, tailwindConfig, 'utf-8');

    const tailwindDirectives = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    `;
    fs.writeFileSync(cssFilePath, tailwindDirectives, 'utf-8');

    // Install additional dependencies
    runCmd(`npm install ${dependencies.join(" ")}`);

    // Create custom folder structure
    folderStructure.forEach((folder) => fs.mkdirSync(path.join(process.cwd(), folder), { recursive: true }));

    console.log("React client setup complete!");
};

// Export setup function
module.exports = setupReactClient;