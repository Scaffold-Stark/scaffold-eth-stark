const fs = require("fs");
const path = require("path");

// Adjust this path to point to the exact file you want to modify
const filePath = path.join(__dirname, "../scaffold-eth-2/packages/nextjs/components/ScaffoldEthAppWithProviders.tsx");

function removeScaffoldEthAppLine(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const updatedContent = content.replace(/<ScaffoldEthApp>\s*\{children\}\s*<\/ScaffoldEthApp>/g, "{children}");

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated: ${filePath}`);
    } else {
      console.log("No changes were necessary.");
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

removeScaffoldEthAppLine(filePath);
console.log("Finished processing file.");
