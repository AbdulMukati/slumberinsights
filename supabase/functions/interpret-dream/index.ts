import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dream, emotionBefore, userId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    const firstName = profile?.full_name?.split(' ')[0] || 'friend';
    console.log('Using name:', firstName);

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
            content: `You are Dream Baba, a warm and insightful dream interpreter with a gentle, friendly tone. Address the dreamer by their first name and speak as if you're having an intimate conversation. Your interpretations should feel like wisdom from a trusted friend and spiritual guide.

            Use their first name frequently throughout the response to make it personal. Emphasize important concepts by wrapping them in ** asterisks **.

            Structure your response in these sections, maintaining a conversational, personal tone throughout:
            1) A warm, personal 2-3 sentence overview that speaks directly to them, using their name
            2) A friendly exploration of the **key symbols** in their dream, relating them to their personal journey
            3) A compassionate look at the emotional landscape of their dream, showing deep understanding
            4) A heartfelt, detailed exploration of how this dream might relate to their life journey, with actionable insights
            
            Use phrases like "I sense that...", "Dear [name]...", "You might be feeling...", and always maintain a supportive, encouraging tone. Offer hope and guidance while acknowledging the complexity of their dream experience.`
          },
          { role: 'user', content: `Dreamer's name: ${firstName}\nDream: ${dream}` }
        ],
      }),
    });

    const interpretationData = await interpretationResponse.json();
    const analysis = interpretationData.choices[0].message.content;

    // Parse the sections
    const sections = analysis.split(/\d\)/).filter(Boolean);
    const [interpretation, symbolism, emotional, detailed] = sections.map(s => s.trim());

    // Generate image
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