const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

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

    // Find the corresponding PNG file
    const pngFiles = findFiles(srcDir, new RegExp(`/${imageFilename}$`));
    if (pngFiles.length === 0) {
      console.warn(`Warning: PNG file not found for ${jsonFile}`);
      continue;
    }
    const pngFile = pngFiles[0];

    // Extract the prompt from the JSON data
    const prompt = jsonData.prompt;
    const number = jsonData.id;

    // Replace spaces with underscores and remove special characters
    const newFilename = `${prompt.replace(/[^\w\s]/g, '').replace(/\s/g, '_')}-${imageFilename}`;

    // Copy the PNG file to the destination directory with the new name
    exec(`cp "${pngFile}" "${path.join(destDir, newFilename)}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
      } else {
        console.log(`Copied ${pngFile} to ${path.join(destDir, newFilename)}`);
      }
    });
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