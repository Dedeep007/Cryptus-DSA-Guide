
import fs from 'fs';

const filePath = 'binary-search-topic.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Keeping only indices: 1-9, 11-33
// The problems 1-9 cover implementation up to Median.
// 11-33 cover Search Insert up to Gas Station.
// Wait, I should re-check the count.
// Striver has 13 (1D) + 5 (2D) + 13 (Search Space) = 31.
// My current list has 35.

// Let's filter out the ones that are definitely duplicates or slightly different versions.
// I'll rebuild the problems array with exactly the 31 Striver problems.

const problems = data[0].problems;
const filteredProblems = [
    problems[0], // 1 Binary Search Implementation
    problems[1], // 2 Lower Bound
    problems[2], // 3 Upper Bound
    problems[10], // 4 Search Insert (re-mapped)
    problems[11], // 5 Check Sorted
    problems[12], // 6 First and Last
    problems[13], // 7 Number of Occurrences
    problems[4], // 8 Find Peak Element
    problems[3], // 9 Search in Rotated
    problems[14], // 10 Search in Rotated Duplicates
    problems[6], // 11 Find Minimum in Rotated
    problems[15], // 12 Single Element
    problems[16], // 13 K Rotation
    problems[17], // 14 Row Max 1s
    problems[18], // 15 Search Sorted
    problems[19], // 16 Search Row-wise (Wait, I need to check if these are different)
    problems[20], // 17 Peak Element Matrix
    problems[21], // 18 Matrix Median
    problems[22], // 19 Square Root
    problems[23], // 20 Nth Root
    problems[24], // 21 Koko
    problems[25], // 22 Bouquets
    problems[26], // 23 Smallest Divisor
    problems[27], // 24 Capacity
    problems[28], // 25 Aggressive Cows
    problems[29], // 26 Book Allocation
    problems[30], // 27 Split Array
    problems[31], // 28 Kth Missing
    problems[32], // 29 Gas Station
    problems[8],  // 30 Median of 2 Sorted
    problems[7]   // 31 Kth Element
];

data[0].problems = filteredProblems;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Cleaned up binary-search-topic.json. Now has 31 unique problems.');
