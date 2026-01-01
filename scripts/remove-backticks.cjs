const fs = require('fs');
const path = require('path');

function removeBackticksFromSubmissionFormat(obj) {
    if (typeof obj !== 'object' || obj === null) return;

    // Handle submissionFormat field
    if (obj.submissionFormat && typeof obj.submissionFormat === 'string') {
        // Remove backticks from code blocks
        obj.submissionFormat = obj.submissionFormat.replace(/`/g, '');
    }

    // Recursively process all properties
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            removeBackticksFromSubmissionFormat(obj[key]);
        }
    }
}

function processJsonFiles() {
    const topicsDir = path.join(__dirname, '..', 'json_store', 'topic-jsons');
    const files = fs.readdirSync(topicsDir).filter(f => f.endsWith('.json') && f !== 'merged-topics.json');

    console.log('Removing backticks from submission formats...\n');

    let totalFixed = 0;

    for (const file of files) {
        const filePath = path.join(topicsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        let beforeStr = JSON.stringify(data);
        removeBackticksFromSubmissionFormat(data);
        let afterStr = JSON.stringify(data);

        if (beforeStr !== afterStr) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`✓ Fixed: ${file}`);
            totalFixed++;
        }
    }

    console.log(`\nRemoved backticks from ${totalFixed} files.`);
}

processJsonFiles();
