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
    "dotenv",
    "@types/node"

]

const folderStructures = [
    "src/controllers",
    "src/middlewares",
    "src/models",
    "src/routes",
    "src/config"
]

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

const PreScripts =  {
    "prebuild": "tslint -c tslint.json -p tsconfig.json --fix",
    "build": "tsc",
    "watch": "tsc -w",
    "prestart": "npm run build",
    "start": "nodemon .",
    "dev": "npx concurrently --kill-others \" npm run watch \" \" npm start \" "
};

const configTs = 
`
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

module.exports = {
    dependencies,
    devDependencies,
    folderStructures,
    tsConfig,
    tslintConfig,
    PreScripts,
    configTs,
    indexTs,
    appTs
}