#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const readline = require("readline");

// Import setup functions from client and server
const setupClient = require("./client/setup");
const setupServer = require("./server/setup");

const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
    }));
};

const main = async () => {
    // Get command-line arguments (skip the first two which are node and script path)
    const args = process.argv.slice(2);

    // Determine which parts to install (client, server, or both)
    const installClient = args.length === 0 || args.includes("client");
    const installServer = args.length === 0 || args.includes("server");

    if (!installClient && !installServer) {
        console.error("Invalid argument. Use 'client', 'server', or no argument to install both.");
        process.exit(1);
    }

    let mainFolder;
    
    // Only ask for the main folder name if both client and server are being installed
    if (installClient && installServer) {
        mainFolder = await askQuestion("Enter the main folder name (where client and server will be created): ");
    } else {
        // Use current working directory if only one folder is being installed
        mainFolder = process.cwd();
    }

    // Resolve absolute path
    const absoluteMainFolder = path.resolve(mainFolder);

    // Create main folder if it doesn't exist
    fs.mkdirSync(absoluteMainFolder, { recursive: true });

    // Create client and/or server directories if selected
    if (installClient) {
        const clientFolder = path.join(absoluteMainFolder, "client");
        fs.mkdirSync(clientFolder, { recursive: true });
        console.log("Setting up client...");
        await new Promise((resolve) => {
            setupClient(clientFolder);
            resolve();
        });
    }

    if (installServer) {
        const serverFolder = path.join(absoluteMainFolder, "server");
        fs.mkdirSync(serverFolder, { recursive: true });
        console.log("Setting up server...");
        await new Promise((resolve) => {
            setupServer(serverFolder);
            resolve();
        });
    }

    console.log("Full-stack project setup complete!");
};

main();