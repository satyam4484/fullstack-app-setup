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

// Modify main.tsx to include necessary imports and basic setup
const modifyMainTsx = (clientFolder) => {
    const mainTsxPath = path.join(clientFolder, "src", "main.tsx");

    const mainTsxContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
`;

    fs.writeFileSync(mainTsxPath, mainTsxContent, 'utf-8');
};

// Create a common README.md in the src folder
const createSrcReadme = (clientFolder) => {
    const readmePath = path.join(clientFolder, "src", "README.md");

    const readmeContent = `
## Project Structure - \`src\`
\`src\`: The main source directory for the application.
     - \`assets\`: assets folder can contain all the static files such as images, fonts, etc.
     - \`components\`: shared components used across the entire application.
     - \`config\`: global configurations, exported env variables etc.
     - \`context\`: React context providers.
     - \`features\`: Feature-specific modules, often containing components, hooks, and other related files.
     - \`hooks\`: shared custom hooks used across the entire application.
     - \`pages\`: page components, typically used with routing.
     - \`reducers\`: redux reducers or other state management logic.
     - \`routes\`: route definitions and related components.
     - \`services\`: API service calls and other external interactions.
     - \`styles\`: global styles and theme definitions.
     - \`utils\`: utility functions and helpers.
`;

    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
};

// Create React app and set up
const setupReactClient = (clientFolder) => {
    console.log("Creating React client...");

    // Change to the client directory
    process.chdir(clientFolder);

    // Create React app and move to that directory
    runCmd("npm create vite@latest . -- --template react-ts");
    runCmd("npm install -D tailwindcss postcss autoprefixer");
    runCmd("npx tailwindcss init -p");

    // Modify main.tsx to include react-router-dom
    modifyMainTsx(clientFolder);

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

    const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;
    `;
    fs.writeFileSync(cssFilePath, tailwindDirectives, 'utf-8');

    // Install additional dependencies
    runCmd(`npm install ${dependencies.join(" ")}`);

    // Create custom folder structure
    folderStructure.forEach((folder) => fs.mkdirSync(path.join(process.cwd(), folder), { recursive: true }));

    // Create a common README.md in the src folder
    createSrcReadme(clientFolder);

    console.log("React client setup complete!");
};

// Export setup function
module.exports = setupReactClient;