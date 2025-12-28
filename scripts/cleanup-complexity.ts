import fs from 'fs';
import path from 'path';

const jsonStoreDir = path.join(process.cwd(), 'json_store');
const files = fs.readdirSync(jsonStoreDir).filter(f => f.endsWith('.json'));

// Regex to match Time and Space complexity comments
// Handles //, #, and * (for Javadoc/multiline)
// Also matches cases where they are on the same line or separate lines
const complexityRegex = /^\s*(\/\/|#|\*)\s*(Time|Space|Complexity)\s*[:\-].*?$/gim;
const inlineComplexityRegex = /(\/\/|#|\*)\s*(Time|Space|Complexity)\s*[:\-].*?(\n|$)/gi;

// Also remove empty comment lines left behind
const emptyCommentRegex = /^\s*(\/\/|#)\s*$/gm;

function cleanCode(code: string): string {
    if (!code) return code;

    // First, remove full lines that are just complexity comments
    let cleaned = code.replace(complexityRegex, '');

    // Also handle cases where complexity might be at the end of a line or in a block
    cleaned = cleaned.replace(inlineComplexityRegex, '');

    // Remove triple newlines if any were created
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // Trim leading complexity comments specifically if they are separated by \n
    // like "// Time: O(N)\n// Space: O(1)\n\n"
    return cleaned.trim();
}

function processProblem(p: any) {
    if (p.submissionFormat) {
        p.submissionFormat = cleanCode(p.submissionFormat);
    }

    if (p.solutions && Array.isArray(p.solutions)) {
        p.solutions.forEach((s: any) => {
            if (s.code) s.code = cleanCode(s.code);
        });
    }

    if (p.codeExamples && Array.isArray(p.codeExamples)) {
        p.codeExamples.forEach((e: any) => {
            if (e.code) e.code = cleanCode(e.code);
        });
    }

    // Recursively check for problems in learning, easy, medium, hard
    ['problems', 'learning', 'easy', 'medium', 'hard'].forEach(key => {
        if (p[key] && Array.isArray(p[key])) {
            p[key].forEach(processProblem);
        }
    });
}

files.forEach(file => {
    const filePath = path.join(jsonStoreDir, file);
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (Array.isArray(content)) {
            content.forEach(processProblem);
        } else {
            processProblem(content);
        }

        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        console.log(`Cleaned ${file}`);
    } catch (e) {
        console.error(`Error processing ${file}:`, e);
    }
});
