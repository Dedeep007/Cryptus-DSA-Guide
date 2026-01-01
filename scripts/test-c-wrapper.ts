import { analyzeCode, generateWrapper } from '../server/executor';

const code = `#include <stdlib.h>
#include <string.h>

typedef struct TrieNode {
    int cntWord, cntPre;
    struct TrieNode* child[26];
} TrieNode;

// ... (abbrev)

typedef struct {
    TrieNode* root;
} Trie;

Trie* trieCreate() {
    // ...
}

void trieInsert(Trie* obj, char* word) {
    // ...
}

int countWordsEqualTo(Trie* obj, char* word) {
    // ...
    return 0;
}

int countWordsStartingWith(Trie* obj, char* prefix) {
    // ...
    return 0;
}

void trieErase(Trie* obj, char* word) {
    // ...
}
`;

const analysis = analyzeCode(code, 'c');
// Mock parsing of test input
const parsed = {
    variables: {},
    rawValues: [
        '["Trie", "insert", "insert", "countWordsEqualTo", "countWordsStartingWith", "erase", "countWordsEqualTo"]',
        '[[], ["apple"], ["apple"], ["apple"], ["app"], ["apple"], ["apple"]]'
    ]
};

// We need to inject the rawValues into the generation process.
// But generateWrapper takes 'input' string and calls parseTestInput.
// So we should simulate the full flow or call generateCWrapper directly if we export it.
// generateCWrapper is NOT exported.
// generateWrapper calls it.

// Let's use generateWrapper.
const input = `["Trie", "insert", "insert", "countWordsEqualTo", "countWordsStartingWith", "erase", "countWordsEqualTo"]\n[[], ["apple"], ["apple"], ["apple"], ["app"], ["apple"], ["apple"]]`;

console.log("Analysis:", JSON.stringify(analysis, null, 2));

const wrapper = generateWrapper('c', code, input);
console.log(wrapper);
