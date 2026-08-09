const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const analyzeProductImage = async (file) => {

  try {

    if (!file) {
      throw new Error("No image provided");
    }


    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing. Check backend/.env"
      );
    }


    const base64Image =
      file.buffer.toString("base64");


    const prompt = `
You are an AI shopping assistant for a price comparison website called Mol Bhao.

Analyze the uploaded image and identify the MAIN product that the user wants to search for.

Return ONLY valid JSON.

Use exactly this format:

{
  "searchQuery": "",
  "productName": "",
  "category": "",
  "brand": "",
  "color": "",
  "productType": "",
  "description": ""
}

Rules:

- Identify the main product visible in the image.
- Detect the most important visible color.
- Identify the product type accurately.
- Identify the brand only when it is clearly visible.
- Do not invent a brand, model, or feature.
- Create a short, useful searchQuery to find the same or closest product online.
- Include useful visible details such as:
  color, brand, product type, style, material, pattern, model.
- If the exact product cannot be identified, create the closest searchable description.
- Return empty string for details that cannot be confidently identified.
- Return ONLY JSON.
- Do not use markdown.
- Do not add \`\`\`json.
- Do not add explanations.

Examples:

For an image of a red Nike t-shirt:

{
  "searchQuery": "red Nike t-shirt",
  "productName": "Red Nike T-Shirt",
  "category": "Fashion",
  "brand": "Nike",
  "color": "Red",
  "productType": "T-Shirt",
  "description": "Red Nike casual t-shirt"
}

For an image of a pink embroidered kurta:

{
  "searchQuery": "pink embroidered kurta",
  "productName": "Pink Embroidered Kurta",
  "category": "Fashion",
  "brand": "",
  "color": "Pink",
  "productType": "Kurta",
  "description": "Pink traditional embroidered kurta"
}
`;


    const response =
      await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: [

          {
            text: prompt,
          },

          {
            inlineData: {
              mimeType: file.mimetype,
              data: base64Image,
            },
          },

        ],

        config: {
          responseMimeType:
            "application/json",
        },

      });


    const text =
      response.text;


    console.log(
      "Gemini Raw Response:",
      text
    );


    if (!text) {
      throw new Error(
        "Gemini did not return any response"
      );
    }


    let parsedData;


    try {

      parsedData =
        JSON.parse(text);

    } catch (parseError) {

      console.error(
        "JSON Parse Error:",
        parseError
      );

      console.error(
        "Invalid Gemini Response:",
        text
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );

    }


    return parsedData;

  } catch (error) {

    console.error(
      "Gemini Vision Error Full:",
      error
    );


    console.error(
      "Gemini Vision Error Message:",
      error.message
    );


    throw error;

  }

};


module.exports = {
  analyzeProductImage,
};