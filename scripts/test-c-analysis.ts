import { analyzeCode } from '../server/executor';

const code = `#include <stdlib.h>
#include <string.h>

typedef struct TrieNode {
    int cntWord, cntPre;
    struct TrieNode* child[26];
} TrieNode;

TrieNode* createNode() {
    TrieNode* node = (TrieNode*)malloc(sizeof(TrieNode));
    node->cntWord = 0;
    node->cntPre = 0;
    for (int i = 0; i < 26; i++) {
        node->child[i] = NULL;
    }
    return node;
}

typedef struct {
    TrieNode* root;
} Trie;

Trie* trieCreate() {
    Trie* trie = (Trie*)malloc(sizeof(Trie));
    trie->root = createNode();
    return trie;
}

void trieInsert(Trie* obj, char* word) {
    // ...
}

int countWordsEqualTo(Trie* obj, char* word) {
    // ...
    return 0;
}
`;

const analysis = analyzeCode('c', code);
console.log(JSON.stringify(analysis, null, 2));
