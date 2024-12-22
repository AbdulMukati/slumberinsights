import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { dream } = await req.json()

    // Generate dream analysis with GPT-4
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional dream interpreter with expertise in Jungian psychology, symbolism, and emotional analysis. 
            Analyze dreams comprehensively in English and structure your response in these exact sections:
            1) Brief Interpretation: A concise 2-3 sentence overview of the dream's main meaning
            2) Symbolic Analysis: Detailed analysis of key symbols and their cultural/psychological significance
            3) Emotional Analysis: Insight into the emotional landscape of the dream and what it reveals about the dreamer's psyche
            4) Detailed Personal Interpretation: A thorough exploration of how this dream might relate to the dreamer's life, challenges, and growth
            
            Keep each section focused and meaningful. Use clear language and avoid jargon unless necessary.`
          },
          {
            role: "user",
            content: `Analyze this dream: ${dream}`
          }
        ],
        temperature: 0.7
      })
    })

    const analysisData = await openAIResponse.json()
    const analysis = analysisData.choices[0].message.content

    // Parse the sections from the GPT response
    const sections = analysis.split(/\d\)/).filter(Boolean)
    const [interpretation, symbolism, emotional, detailed] = sections.map(s => s.trim())

    // Generate a title for the dream
    const titleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Create a short, poetic title (maximum 6 words) for this dream. Make it evocative and meaningful."
          },
          {
            role: "user",
            content: dream
          }
        ],
        temperature: 0.7
      })
    })

    const titleData = await titleResponse.json()
    const title = titleData.choices[0].message.content.replace(/"/g, '')

    // Generate dream image with DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a dreamy, artistic interpretation of this dream: ${dream}. Style: surreal, ethereal, dreamlike quality.`,
        n: 1,
        size: "1024x1024"
      })
    })

    const imageData = await imageResponse.json()
    const imageUrl = imageData.data[0].url

    return new Response(
      JSON.stringify({
        interpretation,
        symbolism,
        emotional_analysis: emotional,
        detailed_interpretation: detailed,
        image_url: imageUrl,
        title
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})