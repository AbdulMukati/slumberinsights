import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dream, userName } = await req.json();
    console.log('Received dream from:', userName);

    // Generate title
    const titleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Create a short, mystical title (maximum 6 words) for this dream. Make it evocative and meaningful, like a fortune cookie message.'
          },
          { role: 'user', content: dream }
        ],
      }),
    });

    const titleData = await titleResponse.json();
    const title = titleData.choices[0].message.content.replace(/"/g, '');
    console.log('Generated title:', title);

    // Generate dream interpretation
    const interpretationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a warm, empathetic dream interpreter with a gentle, friendly tone. Address the dreamer by name and speak as if you're having a heart-to-heart conversation. Your interpretations should feel like wisdom from a trusted friend or mentor, combining psychological insight with a touch of mystical understanding.

            Structure your response in these sections, maintaining a conversational, personal tone throughout:
            1) Brief Interpretation: A warm, personal 2-3 sentence overview that speaks directly to them
            2) Symbolic Analysis: A friendly exploration of the symbols in their dream, relating them to universal human experiences
            3) Emotional Analysis: A compassionate look at the emotional landscape of their dream, showing understanding and empathy
            4) Detailed Personal Interpretation: A heartfelt, detailed exploration of how this dream might relate to their life journey
            
            Use phrases like "I sense that...", "You might be feeling...", "This reminds me of...", and always maintain a supportive, encouraging tone.`
          },
          { role: 'user', content: `Dreamer's name: ${userName}\nDream: ${dream}` }
        ],
      }),
    });

    const interpretationData = await interpretationResponse.json();
    const analysis = interpretationData.choices[0].message.content;
    console.log('Generated interpretation:', analysis);

    // Parse the sections
    const sections = analysis.split(/\d\)/).filter(Boolean);
    const [interpretation, symbolism, emotional, detailed] = sections.map(s => s.trim());

    // Generate image without text
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a single dreamlike, artistic interpretation of this dream without any text or words: ${dream}. Style: surreal, ethereal, dreamlike quality, artistic, meaningful symbolism. Do not include any text or letters in the image.`,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      }),
    });

    const imageData = await imageResponse.json();
    const imageUrl = imageData.data[0].url;
    console.log('Generated image URL:', imageUrl);

    return new Response(
      JSON.stringify({
        title,
        interpretation,
        symbolism,
        emotional_analysis: emotional,
        detailed_interpretation: detailed,
        image_url: imageUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});