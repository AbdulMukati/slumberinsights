import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getUserName, generateTitle, generateImage } from './utils.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dream, emotionBefore, userId, useIslamicInterpretation } = await req.json();
    console.log('Processing dream interpretation request:', { useIslamicInterpretation, dreamLength: dream?.length });

    // Get user's first name
    const userName = await getUserName(userId);
    console.log('Retrieved user name:', userName);

    // Generate interpretation with personalized prompt
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
            content: useIslamicInterpretation 
              ? `You are Dream Baba, a wise and deeply knowledgeable Islamic dream interpreter addressing ${userName} personally. Use their name throughout the interpretation to make it more personal. Your interpretations MUST be comprehensive and detailed, incorporating multiple references from Islamic sources.

                Structure your response in these detailed sections:

                1) Begin with 'Bismillah' and a warm, personal greeting to ${userName}, followed by a brief overview of the dream's significance in Islamic context.
                
                2) **Quranic References**: Cite AT LEAST THREE specific verses from the Quran that relate to the symbols or themes in the dream. Include both the Arabic text and its translation.
                
                3) **Hadith Analysis**: Include AT LEAST THREE relevant Hadith that discuss similar dream symbols or themes.
                
                4) **Detailed Islamic Symbolism**: Analyze each major symbol according to classical Islamic dream interpretation books.
                
                5) **Spiritual Guidance**: Provide specific spiritual advice based on the interpretation.
                
                6) **Contemporary Perspective**: Add a modern psychological perspective section.
                
                Use phrases like "Dear ${userName}..." and maintain a supportive, encouraging tone while staying true to Islamic principles.
                
                Here is the dream: "${dream}"`
              : `You are Dream Baba, a warm and insightful dream interpreter speaking directly to ${userName}. Use their name frequently throughout the response to make it personal and intimate. Your interpretation should feel like wisdom from a trusted friend and spiritual guide.

                Structure your response in these sections:
                1) A warm, personal 2-3 sentence overview that speaks directly to ${userName}
                2) A friendly exploration of the **key symbols** in their dream, relating them to their personal journey
                3) A compassionate look at the emotional landscape of their dream
                4) A heartfelt, detailed exploration of how this dream might relate to their life journey
                
                Use phrases like "Dear ${userName}..." and maintain a supportive, encouraging tone.
                
                Here is the dream: "${dream}"`
          },
          { 
            role: 'user', 
            content: `Please interpret this dream while considering ${userName}'s initial emotion: ${emotionBefore}` 
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      }),
    });

    const interpretationData = await interpretationResponse.json();
    console.log('Interpretation response:', interpretationData);

    if (!interpretationData.choices?.[0]?.message?.content) {
      throw new Error('Failed to generate interpretation');
    }

    const interpretation = interpretationData.choices[0].message.content;

    // Generate title and image in parallel
    const [title, imageUrl] = await Promise.all([
      generateTitle(openAIApiKey, dream, useIslamicInterpretation),
      generateImage(openAIApiKey, dream, useIslamicInterpretation)
    ]);

    // Parse sections based on interpretation type
    let sections;
    if (useIslamicInterpretation) {
      const parts = interpretation.split(/\d\)\s+/).filter(Boolean);
      sections = {
        interpretation: parts[0]?.trim() || '',
        symbolism: parts[3]?.trim() || '',
        emotional_analysis: parts[2]?.trim() || '',
        detailed_interpretation: [
          parts[1]?.trim() || '',
          parts[4]?.trim() || '',
          parts[5]?.trim() || ''
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

    return new Response(
      JSON.stringify({
        title,
        ...sections,
        image_url: imageUrl,
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
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});