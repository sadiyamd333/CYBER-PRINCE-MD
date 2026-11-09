exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const API_KEY = "AQ.Ab8RN6IzoiQO3LacO9QLbLC9yY4xl7jeMRQOffQAkglXflrG-g";

  try {
    const { prompt } = JSON.parse(event.body);

    // Using gemini-1.5-flash for stable and fast responses
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await apiResponse.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: data.candidates[0].content.parts[0].text })
      };
    } else {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Google AI Error: ' + JSON.stringify(data) }) 
      };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
