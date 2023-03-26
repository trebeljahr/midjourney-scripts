import { exiftool } from "exiftool-vendored";
import { renameSync } from "fs"
import { readdir } from "fs/promises";
import path from "path";

// Check if the correct number of arguments are provided
if (process.argv.length !== 3) {
  console.log("Usage: node script.js <directory>");
  process.exit(1);
}

// Directory to search in
const dir = process.argv[2];

// Find all image files recursively and rename them with their width and height in the title
(async () => {
  const imageFiles = await findFiles(dir, /\.(jpg|jpeg|png)$/i);
  for (const imagePath of imageFiles) {
    try {
      const tags = await exiftool.read(imagePath);
      const width = tags.ImageWidth;
      const height = tags.ImageHeight;
      const {name, ext} = path.parse(imagePath)
      const newTitle = `${name}::${width}x${height}${ext}`;

      console.log(newTitle)

      
      
      const newPath = path.join(path.dirname(imagePath), newTitle)
      
      renameSync(imagePath, newPath)
      
      console.log(`Renamed ${imagePath} to ${newTitle}`);
    } catch (err) {
      console.error(`Error processing ${imagePath}:`, err);
    }
  }
  console.log(`Renamed all images in ${dir}`);
  exiftool.end()
})();

async function findFiles(dir, pattern) {
  const files = await readdir(dir, { withFileTypes: true });
  let results = [];
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(await findFiles(filePath, pattern));
    } else if (pattern.test(filePath)) {
      results.push(filePath);
    }
  }
  return results;
}
