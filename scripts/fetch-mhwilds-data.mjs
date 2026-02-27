// scripts/fetch-mhwilds-data.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://wilds.mhdb.io/en';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data', 'mhwilds');

const CATEGORIES = [
    'monsters',
    'weapons',
    'armor',
    'armor/sets',
    'skills',
    'items',
    'decorations',
    'charms',
    'locations',
    'ailments'
];

async function fetchApi(endpoint) {
    const url = `${BASE_URL}/${endpoint}`;
    console.log(`Fetching ${url}...`);
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

async function main() {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Fetch and save all categories
    for (const category of CATEGORIES) {
        try {
            const data = await fetchApi(category);
            
            // Handle subfolders like 'armor/sets' -> 'armor-sets.json'
            const filename = category.replace(/\//g, '-') + '.json';
            const filepath = path.join(OUTPUT_DIR, filename);
            
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
            console.log(`✓ Saved ${data.length} items to ${filename}`);
        } catch (error) {
            console.error(`✗ Error processing ${category}:`, error.message);
            process.exit(1);
        }
    }
    
    console.log('✨ All MH Wilds data fetched successfully!');
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
