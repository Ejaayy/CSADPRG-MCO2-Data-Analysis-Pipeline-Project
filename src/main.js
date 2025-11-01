// src/main.js

// MAIN CONTROLLER FILE

//Necessary Imports
import fs from "fs";
import { parse } from "csv-parse/sync";
import { processData } from "./dataProcessor.js";
import promptSync from 'prompt-sync';

let loop = true

while(loop) {

    const prompt = promptSync();

    console.log("Select Language Implementation")
    console.log("[1] Load the file")
    console.log("[2] Generate Reports")
    console.log("[0] Exit\n")

    const choice = prompt("Choice:");

    switch (choice) {

        case "1":
            // Make sure output folder exists
            if (!fs.existsSync("./output")) {
                fs.mkdirSync("./output");
            }

            //Read the CSV
            //Stored as plain text each line separated by \n
            process.stdout.write("Processing dataset...");
            const rawCsv = fs.readFileSync("../data/dpwh_flood_control_projects.csv", "utf8");

            //Parse CSV into array of JavaScript objects
            const records = parse(rawCsv, { columns: true, skip_empty_lines: true });
            //parse() automatically returns an array of objects
            //Each row becomes an  object

            process.stdout.write(`${records.length.toLocaleString()} rows loaded, `);

            // Process & clean data (filter + compute fields)
            const processed = processData(records); //method from dataProcessor.js
            console.log(`${processed.length.toLocaleString()} rows filtered for (2021–2023)\n`);

            break
        case "2":

            break

        case "0":
            loop = false;
            break
    }


}

