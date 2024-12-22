import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const getUserName = async (userId: string) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    // Extract first name from full name
    const firstName = data?.full_name?.split(' ')[0] || 'friend';
    return firstName;
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'friend'; // Fallback if we can't get the name
  }
};

export const generateTitle = async (openAIApiKey: string, dream: string, useIslamicInterpretation: boolean) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

  const data = await response.json();
  console.log('Title generation response:', data);
  return data.choices[0].message.content.replace(/"/g, '');
};

export const generateImage = async (openAIApiKey: string, dream: string, useIslamicInterpretation: boolean) => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
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

  const data = await response.json();
  console.log('Image generation response:', data);
  return data.data?.[0]?.url;
};

export { corsHeaders };