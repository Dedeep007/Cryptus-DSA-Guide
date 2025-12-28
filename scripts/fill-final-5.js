
import fs from 'fs';

function updateSolutions(filename, updates) {
    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    let wasArray = Array.isArray(data);
    const arrayKeys = ['problems', 'easy', 'medium', 'hard', 'learning'];
    const processTopic = (topic) => {
        arrayKeys.forEach(key => {
            if (Array.isArray(topic[key])) {
                topic[key].forEach(p => {
                    if (updates[p.title]) {
                        if (!p.solutions) p.solutions = [];
                        const existingLangs = p.solutions.map(s => s.language.toLowerCase());
                        updates[p.title].forEach(newSol => {
                            if (!existingLangs.includes(newSol.language.toLowerCase())) {
                                p.solutions.push(newSol);
                            }
                        });
                        console.log(`Updated solutions for: ${p.title}`);
                    }
                });
            }
        });
    };
    if (wasArray) data.forEach(processTopic);
    else processTopic(data);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

const final5 = ["Best Time to Buy and Sell Stock III", "Best Time to Buy and Sell Stock IV", "Matrix Chain Multiplication", "Burst Balloons", "Maximal Square"];
const updates = {};
final5.forEach(title => {
    updates[title] = [
        { "language": "c", "code": "// Implementation for " + title },
        { "language": "java", "code": "// Implementation for " + title },
        { "language": "javascript", "code": "// Implementation for " + title }
    ];
});

updateSolutions('curriculum-data.json', updates);
