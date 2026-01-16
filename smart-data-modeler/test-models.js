// Quick test to check available models
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDEoJlG4rCKuYilX1rc34grZJOHhPrmaz0';
const genAI = new GoogleGenerativeAI(apiKey);

// Test the model name from Google's quickstart
const modelsToTest = [
    'gemini-2.0-flash',  // From Google's quickstart
    'gemini-2.0-pro',
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
];

async function testModel(modelName) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "test"');
        console.log(`✅ ${modelName}: Works!`);
        return true;
    } catch (error) {
        console.log(`❌ ${modelName}: ${error.message.substring(0, 100)}`);
        return false;
    }
}

async function testAll() {
    console.log('Testing available models...\n');
    for (const model of modelsToTest) {
        await testModel(model);
    }
}

testAll();

