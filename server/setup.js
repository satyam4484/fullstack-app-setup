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

const dependencies = [
    "express",
    "dotenv",
    "cors",
    "mongoose",
    "bcryptjs",
    "concurrently",
    "cors",
    "jsonwebtoken",
    "nodemon",
    "tslint"
]

const devDependencies = [
    "typescript",
    "dotenv"

]

// Read dependencies and folder structure
// const dependencies = require("./dependencies.json");
const folderStructure = require("./folder-structure.json");

// Create Node.js + TypeScript server setup
const setupNodeServer = (serverFolder) => {
    console.log("Creating Node.js + TypeScript server..." ,serverFolder);

    process.chdir(serverFolder);


    // Initialize Node project
    runCmd("npm init -y",serverFolder);

    // Install server dependencies
    runCmd(`npm install ${dependencies.join(" ")}`);
    runCmd(`npm install -D ${devDependencies.join(" ")}`);

    // Create tsconfig.json
    const tsConfig = {
        "compilerOptions": {
            "module": "NodeNext",
            "moduleResolution": "NodeNext",
            "target": "ES2020",
            "esModuleInterop": true,
            "sourceMap": true,
            "outDir": "./dist",

        },

        "include": ["src/**/*.ts", "src/config.ts"],
        "exclude": ["node_modules"]
    };

    const tslintConfig = {
        "target": "esnext",
        "compilerOptions": {
            "module": "NodeNext",
            "outDir": "./dist",
            "strict": true,
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "skipLibCheck": true,
            "allowSyntheticDefaultImports": true,
            "lib": [
                "dom",
                "dom.iterable",
                "esnext"
            ],
            "allowJs": true,
            "allowUnreachableCode": false,
            "strictNullChecks": true,
            "noImplicitAny": true,
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true,
            "sourceMap": true,
            "declaration": false,
            "typeRoots": [
                "node_modules/@types"
            ],
            "moduleResolution": "NodeNext"
        },
        "include": [
            "src"
        ]
    }
    fs.writeFileSync("tsconfig.json", JSON.stringify(tsConfig, null, 2));
    fs.writeFileSync("tslint.json", JSON.stringify(tslintConfig, null, 2));


    const packageJson = require(path.join(process.cwd(), "package.json"));
    packageJson.scripts = {
        "prebuild": "tslint -c tslint.json -p tsconfig.json --fix",
        "build": "tsc",
        "watch": "tsc -w",
        "prestart": "npm run build",
        "start": "nodemon .",
        "dev": "npx concurrently --kill-others \" npm run watch \" \" npm start \" "
    };
    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    // Create custom folder structure and example files
    folderStructure.forEach((folder) => fs.mkdirSync(path.join(process.cwd(), folder), { recursive: true }));

    const configTs = `
                    import dotenv from 'dotenv';
                    dotenv.config();

                    interface AppConfigs {
                        MONGO_URL: string | undefined;
                        PORT: number | undefined;
                    }

                    const appConfigs: AppConfigs = {
                        MONGO_URL: process.env.MONGO_URL,
                        PORT: parseInt(process.env.PORT),
                    };

                    export default appConfigs;
                    `

    fs.writeFileSync(path.join(process.cwd(), "src", "config.ts"), configTs);
    // Create index.ts as entry point
    const indexTs = `
                import express from 'express';
                import dotenv from 'dotenv';
                import mongoose from 'mongoose';
                import appConfigs from './config.js';
                import app from './app.js';

                dotenv.config();

                console.log("Starting the application...");

                const connectToDatabase = async (): Promise<void> => {
                    try {
                        console.warn("Attempting to connect to the database...");
                        await mongoose.connect(appConfigs.MONGO_URL);
                        console.log("Database connected successfully.");
                    } catch (error) {
                        console.error("Failed to connect to the database.", error);
                        throw error;
                    }
                };

                const startServer = (): void => {
                    app.listen(appConfigs.PORT, (): void => {
                        console.log(\`Server is running and listening on port \${appConfigs.PORT}\`);
                    });
                };

                const initializeApp = async (): Promise<void> => {
                    try {
                        await connectToDatabase();
                        startServer();
                        console.log("Application started successfully.");
                    } catch (error) {
                        console.error("Application startup failed.", error);
                    }
                };

                initializeApp();

                export default app;
                `;

        
    fs.writeFileSync(path.join(process.cwd(), "src", "index.ts"), indexTs);


    const appTs = `
import express, { Express } from "express";
import cors from "cors";
import appConfigs from "./config.js";

const app: Express = express();

console.log("Initializing Express application...");

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());

console.log("Setting up session middleware...");


console.log("Initializing Passport authentication middleware...");

console.log("Setting up CORS...");
app.use(cors({
    origin: '*', // Specify the frontend origin explicitly
    credentials: true,
}));

console.log("Setting up routes...");


console.log("Express application setup complete.");

export default app;
`;

fs.writeFileSync(path.join(process.cwd(), "src", "app.ts"), appTs);


    // Create .env file
    fs.writeFileSync(".env", "PORT=5000\nMONGO_URL=mongodb://localhost:27017/db");

    console.log("Node.js server setup complete!");
};

// Export setup function
module.exports = setupNodeServer;