const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const imagesDir = path.join(__dirname, "public/images");

const optimizeImages = async () => {
  const files = fs.readdirSync(imagesDir);
  const jpgFiles = files.filter((f) => f.toLowerCase().endsWith(".jpg"));

  const webpFiles = [];

  for (const file of jpgFiles) {
    const inputPath = path.join(imagesDir, file);
    const filenameWithoutExt = path.parse(file).name;
    const outputPath = path.join(imagesDir, `${filenameWithoutExt}.webp`);

    try {
      await sharp(inputPath)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Optimized ${file} -> ${filenameWithoutExt}.webp`);
      webpFiles.push(`/images/${filenameWithoutExt}.webp`);
    } catch (err) {
      console.error(`Failed to optimize ${file}:`, err);
    }
  }

  console.log("Optimized images:", JSON.stringify(webpFiles));
};

optimizeImages();
