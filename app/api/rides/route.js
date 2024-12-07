import path from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';

// Utility function to load CSV data
const loadCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
};

export async function GET(request) {
    try {
        // Define paths to CSV files
        const dataPath = path.join(process.cwd(), 'data');
        const locationsPath = path.join(dataPath, 'Locations_Table.csv');
        const categoriesPath = path.join(dataPath, 'Category_Table.csv');
        const ridesPath = path.join(dataPath, 'Corrected_Rides_Table.csv');

        // Load data from CSV files
        const locations = await loadCSV(locationsPath);
        const categories = await loadCSV(categoriesPath);
        const rides = await loadCSV(ridesPath);

        // Debugging: Check and log the loaded data
        console.log('Locations Data:', locations.slice(0, 5)); // Print first 5 entries
        console.log('Categories Data:', categories.slice(0, 5)); // Print first 5 entries
        console.log('Rides Data:', rides.slice(0, 5)); // Print first 5 entries

        // Format and return the data as JSON
        return new Response(
            JSON.stringify({ locations, categories, rides }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error loading data:', error);
        return new Response(JSON.stringify({ error: 'Failed to load data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
