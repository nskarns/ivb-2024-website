const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all files and directories from the current directory to the dist directory
const filesToCopy = fs.readdirSync(__dirname);

filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(distDir, file);

  if (fs.lstatSync(srcPath).isDirectory()) {
    // Skip the dist and venv directories to avoid infinite loop and unnecessary copying
    if (file !== 'dist' && file !== 'venv') {
      fs.mkdirSync(destPath, { recursive: true });
      // Recursively copy the directory
      copyDirectory(srcPath, destPath);
    }
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
});

function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src);
  entries.forEach(entry => {
    const srcEntry = path.join(src, entry);
    const destEntry = path.join(dest, entry);

    if (fs.lstatSync(srcEntry).isDirectory()) {
      fs.mkdirSync(destEntry, { recursive: true });
      copyDirectory(srcEntry, destEntry);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
    }
  });
}