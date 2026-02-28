const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({});
async function run() {
  const response = await ai.models.list();
  for await (const model of response) {
    if (model.name.includes("flash")) {
      console.log(model.name);
    }
  }
}
run().catch(console.error);
