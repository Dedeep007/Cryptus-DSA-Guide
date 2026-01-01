import { analyzeCode } from '../server/executor';

const code = `public int largest(int[] arr, int n) {
    int ans = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > ans)
            ans = arr[i];
    }
    return ans;
}`;

const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
const regex = /(?:public|private|protected)?\s*(?:static)?\s*([a-zA-Z0-9_<>\[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*\{/;
const match = cleanCode.match(regex);

console.log("Match:", match);
console.log("Analysis:", JSON.stringify(analyzeCode('java', code), null, 2));
