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
    const mainFolder = await askQuestion("Enter the main folder name (where client and server will be created): ");

    // Resolve absolute path
    const absoluteMainFolder = path.resolve(mainFolder);

    // Create main folder if it doesn't exist
    fs.mkdirSync(absoluteMainFolder, { recursive: true });

    // Create client and server directories inside the main folder
    const clientFolder = path.join(absoluteMainFolder, "client");
    const serverFolder = path.join(absoluteMainFolder, "server");

    fs.mkdirSync(clientFolder, { recursive: true });
    fs.mkdirSync(serverFolder, { recursive: true });

    console.log("client--",clientFolder)
    console.log("ser--",serverFolder)
    // Execute setup functions in parallel
    await Promise.all([
        new Promise((resolve) => {
            setupClient(clientFolder);
            resolve();
        }),
        new Promise((resolve) => {
            setupServer(serverFolder);
            resolve();
        })
    ]);

    console.log("Full-stack project setup complete!");
};

main();