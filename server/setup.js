const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { dependencies, devDependencies, folderStructures, tsConfig, tslintConfig, PreScripts, configTs, indexTs, appTs } = require("./mappings");

// Helper to execute shell commands
const runCmd = (cmd) => {
    try {
        execSync(cmd, { stdio: "inherit" });
    } catch (e) {
        console.error(`Failed to execute: ${cmd}`, e);
        process.exit(1);
    }
};


// Create Node.js + TypeScript server setup
const setupNodeServer = (serverFolder) => {
    console.log("Creating Node.js + TypeScript server...", serverFolder);

    process.chdir(serverFolder);


    // Initialize Node project
    runCmd("npm init -y", serverFolder);

    // Install server dependencies
    runCmd(`npm install ${dependencies.join(" ")}`);
    runCmd(`npm install -D ${devDependencies.join(" ")}`);


    fs.writeFileSync("tsconfig.json", JSON.stringify(tsConfig, null, 2));
    fs.writeFileSync("tslint.json", JSON.stringify(tslintConfig, null, 2));


    const packageJson = require(path.join(process.cwd(), "package.json"));
    packageJson.scripts = PreScripts;

    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    // Create custom folder structure and example files
    folderStructures.forEach((folder) => fs.mkdirSync(path.join(process.cwd(), folder), { recursive: true }));



    fs.writeFileSync(path.join(process.cwd(), "src", "config.ts"), configTs);
    fs.writeFileSync(path.join(process.cwd(), "src", "index.ts"), indexTs);



    fs.writeFileSync(path.join(process.cwd(), "src", "app.ts"), appTs);


    // Create .env file
    fs.writeFileSync(".env", "PORT=5000\nMONGO_URL=mongodb://localhost:27017/db");

    console.log("Node.js server setup complete!");
};

// Export setup function
module.exports = setupNodeServer;