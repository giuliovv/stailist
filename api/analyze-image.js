import { OpenAI } from 'openai';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set as an environment variable
  });

  try {
    // Assuming the image data is sent in the request body,
    // potentially as a base64 encoded string or form data.
    // You'll need to adjust this based on how the image is sent.
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is missing' });
    }
    // Ensure the image data is in a format the OpenAI API expects
    // If it's a base64 string, prepend the data URL scheme
    if (typeof image === 'string' && !image.startsWith('data:')) {
      image = `data:image/jpeg;base64,${image}`; // Assuming JPEG, adjust if needed
    }

    // Example of calling the OpenAI Vision API
    // You'll need to format the image data appropriately for the API.
    // For base64, it might look like: `data:image/jpeg;base64,${imageData}`
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image:" },
            {
              type: "image_url",
              image_url: {
                url: image, // Use the formatted image data
              },
            },
          ],
        },
      ],
    });

    res.status(200).json({ analysis: response.choices[0].message.content });

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Error analyzing image' });
  }
}