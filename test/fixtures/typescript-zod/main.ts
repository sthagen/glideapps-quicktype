import * as TopLevel from "./TopLevel";
import fs from "fs";
import process from "process";

const sample = process.argv[2];
const json = fs.readFileSync(sample);

const value = JSON.parse(json.toString());
let schema = TopLevel.TopLevelSchema ?? TopLevel.TopLevelElementSchema;
if (!schema) {
    // Sometimes key is prefixed with funPrefixes (e.g. 2df80.json)
    Object.keys(TopLevel).some((key) => {
        if (
            key.endsWith("TopLevelSchema") ||
            key.endsWith("TopLevelElementSchema")
        ) {
            schema = TopLevel[key];
            return true;
        }
    });
}

if (!schema) {
    throw new Error("No schema found");
}

let backToJson: string;
if (Array.isArray(value)) {
    const parsedValue = value.map((v) => schema.parse(v));
    backToJson = JSON.stringify(parsedValue, null, 2);
} else {
    const parsedValue = schema.parse(value);
    backToJson = JSON.stringify(parsedValue, null, 2);
}

console.log(backToJson);
