import * as fs from 'fs';
import * as path from 'path';
import {exiftool} from 'exiftool-vendored';
import { copyFile } from 'fs/promises';

// Check if the correct number of arguments are provided
if (process.argv.length !== 4) {
  console.log('Usage: node script.js <source_directory> <destination_directory>');
  process.exit(1);
}

// Source and destination directories
const srcDir = process.argv[2];
const destDir = process.argv[3];

// Create the destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Find all JSON files recursively and process them
const jsonFiles = findFiles(srcDir, /\.json$/);
for (const jsonFile of jsonFiles) {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    // Extract the image URL from the JSON data
    const imageUrl = jsonData.image_paths[0];

    // Extract the image filename from the image URL
    const imageFilename = path.basename(imageUrl);
    const jsonDirPath = path.dirname(jsonFile)

    // Find the corresponding PNG file
    const pngFile = path.join(jsonDirPath, imageFilename);
    console.log(pngFile)
 

    // Extract the job ID from the JSON data
    const jobId = jsonData.id;

    // Replace special characters in the prompt with underscores
    const prompt = jsonData.prompt;

    // Construct the new filename with the job ID and image filename
    const newFilename = `${jobId}-${imageFilename}`;

    // Copy the PNG file to the destination directory with the new name and add the prompt to the metadata
    await exiftool.write(`${pngFile}`, {
      Title: prompt,
      CreateDate: jsonData.enqueue_time
    });
    await copyFile(pngFile, path.join(destDir, newFilename));
    console.log(`Copied ${pngFile} to ${path.join(destDir, newFilename)}`);
  } catch (err) {
    console.error(`Error processing ${jsonFile}:`, err);
  }
}

console.log(`PNG files copied from ${srcDir} to ${destDir}`);

function findFiles(dir, pattern) {
  let results = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(findFiles(filePath, pattern));
    } else if (pattern.test(filePath)) {
      results.push(filePath);
    }
  }
  return results;
}