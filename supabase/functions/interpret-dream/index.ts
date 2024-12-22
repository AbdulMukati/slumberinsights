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
    const { dream, emotionBefore, userId, useIslamicInterpretation } = await req.json();
    
    console.log('Processing dream interpretation request:', { useIslamicInterpretation, dreamLength: dream?.length });

    // Generate title first
    console.log('Generating title...');
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
            content: useIslamicInterpretation 
              ? 'Create a short, meaningful Islamic title (maximum 6 words) for this dream that reflects its spiritual significance.'
              : 'Create a short, mystical title (maximum 6 words) for this dream. Make it evocative and meaningful, like a fortune cookie message.'
          },
          { role: 'user', content: dream }
        ],
      }),
    });

    const titleData = await titleResponse.json();
    console.log('Title response:', titleData);

    if (!titleData.choices?.[0]?.message?.content) {
      console.error('Invalid title response:', titleData);
      throw new Error('Failed to generate title');
    }
    const title = titleData.choices[0].message.content.replace(/"/g, '');

    // Generate interpretation
    console.log('Generating interpretation...');
    const systemPrompt = useIslamicInterpretation
      ? `You are Dream Baba, a wise and deeply knowledgeable Islamic dream interpreter with extensive knowledge of the Quran, Hadith, and Islamic dream interpretation traditions. Your interpretations MUST be at least 300 words long and MUST be comprehensive and detailed, incorporating multiple references from Islamic sources.

      Structure your response in these detailed sections, ensuring COMPLETE coverage of each section with NO CUTOFFS:

      1) Begin with 'Bismillah' and a warm, personal greeting, followed by a brief overview of the dream's significance in Islamic context (at least 100 words).
      
      2) **Quranic References**: You MUST cite AT LEAST THREE specific verses from the Quran that relate to the symbols or themes in the dream. Include both the Arabic text and its translation for each verse. Format as: "Allah (سُبْحَانَهُ وَتَعَالَىٰ) says in Surah [name] (verse number): [Arabic] - [Translation]"
      
      3) **Hadith Analysis**: You MUST include AT LEAST THREE relevant Hadith that discuss similar dream symbols or themes. Include the full chain of narration and grade of the Hadith when possible. Format as: "The Prophet Muhammad (ﷺ) said in [source]: [Hadith text]"
      
      4) **Detailed Islamic Symbolism**: Analyze each major symbol in the dream according to classical Islamic dream interpretation books like Ibn Sirin's work. Explain the various possible meanings in Islamic context (at least 100 words).
      
      5) **Spiritual Guidance**: Provide specific spiritual advice based on the dream's interpretation, including recommended duas, dhikr, or actions the dreamer might take (at least 100 words).
      
      6) **Contemporary Perspective**: Add a section providing a modern psychological or general interpretation perspective, clearly labeled as "Non-Islamic Interpretation Perspective" to differentiate it from the Islamic analysis (at least 100 words).
      
      Use phrases like "In the light of Islamic teachings...", "The scholars of dream interpretation mention...", and maintain a supportive, encouraging tone while staying true to Islamic principles.
      
      Emphasize important concepts by wrapping them in ** asterisks **. Keep the tone warm and personal while maintaining Islamic authenticity.
      
      VERY IMPORTANT: Make sure to provide a complete, unabbreviated interpretation that covers all aspects thoroughly. Do not cut off any section. The total interpretation MUST be at least 300 words.

      Here is the dream: "${dream}"`
      : `You are Dream Baba, a warm and insightful dream interpreter with a gentle, friendly tone. Address the dreamer by their first name and speak as if you're having an intimate conversation. Your interpretations should feel like wisdom from a trusted friend and spiritual guide.

      Use their first name frequently throughout the response to make it personal. Emphasize important concepts by wrapping them in ** asterisks **.

      Structure your response in these sections, maintaining a conversational, personal tone throughout:
      1) A warm, personal 2-3 sentence overview that speaks directly to them, using their name
      2) A friendly exploration of the **key symbols** in their dream, relating them to their personal journey
      3) A compassionate look at the emotional landscape of their dream, showing deep understanding
      4) A heartfelt, detailed exploration of how this dream might relate to their life journey, with actionable insights
      
      Use phrases like "I sense that...", "Dear [name]...", "You might be feeling...", and always maintain a supportive, encouraging tone.
      
      Here is the dream: "${dream}"`;

    const interpretationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: `Please interpret this dream while considering the dreamer's initial emotion: ${emotionBefore}` 
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      }),
    });

    const interpretationData = await interpretationResponse.json();
    console.log('Interpretation response:', interpretationData);

    if (!interpretationData.choices?.[0]?.message?.content) {
      console.error('Invalid interpretation response:', interpretationData);
      throw new Error('Failed to generate interpretation');
    }

    const interpretation = interpretationData.choices[0].message.content;

    // Generate image
    console.log('Generating image...');
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a single dreamlike, artistic interpretation of this dream without any text, words, writing, or calligraphy of any kind: ${dream}. Style: ${
          useIslamicInterpretation 
            ? 'Islamic geometric patterns, arabesque design elements, subtle and respectful imagery without human figures or faces, focusing on abstract patterns and nature elements in Islamic art style. The image must be completely free of any text, calligraphy, or writing.' 
            : 'surreal, ethereal, dreamlike quality, artistic, meaningful symbolism. The image must be completely free of any text or writing.'
        }`,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      }),
    });

    const imageData = await imageResponse.json();
    console.log('Image response:', imageData);

    if (!imageData.data?.[0]?.url) {
      console.error('Invalid image response:', imageData);
      throw new Error('Failed to generate image');
    }
    const imageUrl = imageData.data[0].url;

    // Parse the sections
    console.log('Parsing sections...');
    let sections;
    if (useIslamicInterpretation) {
      // Split by numbered sections and clean up
      const parts = interpretation.split(/\d\)\s+/).filter(Boolean);
      
      // Map the parts to their respective sections
      sections = {
        interpretation: parts[0]?.trim() || '', // Bismillah and overview
        symbolism: parts[3]?.trim() || '', // Islamic symbolism section
        emotional_analysis: parts[2]?.trim() || '', // Hadith analysis
        detailed_interpretation: [
          parts[1]?.trim() || '', // Quranic references
          parts[4]?.trim() || '', // Spiritual guidance
          parts[5]?.trim() || ''  // Contemporary perspective
        ].filter(Boolean).join('\n\n')
      };
    } else {
      const parts = interpretation.split(/\d\)\s+/).filter(Boolean);
      sections = {
        interpretation: parts[0]?.trim() || '',
        symbolism: parts[1]?.trim() || '',
        emotional_analysis: parts[2]?.trim() || '',
        detailed_interpretation: parts[3]?.trim() || ''
      };
    }

    console.log('Final sections:', sections);
    return new Response(
      JSON.stringify({
        title,
        ...sections,
        image_url: imageUrl,
        raw_response: interpretationData // Adding raw response for debugging
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in interpret-dream function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'An unexpected error occurred while interpreting your dream'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});