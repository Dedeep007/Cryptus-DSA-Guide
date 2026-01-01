import fs from 'fs';
import path from 'path';

const TOPICS_DIR = path.join(process.cwd(), 'json_store', 'topic-jsons');
const OUTPUT_FILE = path.join(TOPICS_DIR, 'mergerd-info.json');

interface TopicData {
    topic: {
        slug: string;
        [key: string]: any;
    };
    [key: string]: any;
}

interface MergedTopics {
    [slug: string]: TopicData;
}

function mergeTopics() {
    console.log('Merging topic JSONs...');

    if (!fs.existsSync(TOPICS_DIR)) {
        console.error(`Directory not found: ${TOPICS_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(TOPICS_DIR);
    const mergedData: MergedTopics = {};

    for (const file of files) {
        if (!file.endsWith('.json') || file === 'mergerd-info.json' || file === 'merged-topics.json') {
            continue;
        }

        const filePath = path.join(TOPICS_DIR, file);
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const data: TopicData = JSON.parse(content);

            if (data.topic && data.topic.slug) {
                mergedData[data.topic.slug] = data;
                console.log(`Merged: ${file} -> ${data.topic.slug}`);
            } else {
                console.warn(`Skipping ${file}: Missing topic.slug`);
            }
        } catch (error) {
            console.error(`Error reading ${file}:`, error);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mergedData, null, 4));
    console.log(`\nSuccessfully merged ${Object.keys(mergedData).length} topics into ${OUTPUT_FILE}`);
}

mergeTopics();
