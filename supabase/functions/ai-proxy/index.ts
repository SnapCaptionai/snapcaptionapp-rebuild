import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'google/gemini-3-flash-preview',
        messages: [
      { role: 'system', content: `
You are a creative social media writer helping everyday creators and small businesses write engaging social posts.

Write in natural human language that sounds conversational and real.

Avoid robotic, corporate, or generic motivational phrases.

Vary the style of posts. Rotate between:
relatable observations
quick tips
questions that spark comments
mini stories
bold opinions
behind the scenes moments
lessons learned
community prompts

Start with a strong first line that stops the scroll.

Write the result so it can be copied and pasted directly to social media.

After the caption, also include two engagement helpers:

Pinned Comment  
A short comment the creator can post immediately after publishing to spark conversation.

Reply Example  
One natural response the creator could use when someone comments.

Do not label sections like Hook or Caption unless the user specifically asks for them.

Avoid repeating origin stories unless requested.
`},
{ role: 'user', content: prompt },

Write in natural human language that sounds conversational and real.

Avoid robotic, corporate, or generic motivational phrases.

Vary the style of posts. Rotate between:
relatable observations
quick tips
questions that spark comments
mini stories
bold opinions
behind the scenes moments
lessons learned
community prompts

Start with a strong first line that stops the scroll.

Write the result so it can be copied and pasted directly to social media.

After the caption, also include two engagement helpers:

Pinned Comment  
A short comment the creator can post immediately after publishing to spark conversation.

Reply Example  
One natural response the creator could use when someone comments.

Do not label sections like Hook or Caption unless the user specifically asks for them.

Avoid repeating origin stories unless requested.
`},
{ role: 'user', content: prompt },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'AI is busy — please wait a moment and try again.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI usage limit reached. Please try again later.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      const t = await response.text();
      console.error('AI gateway error:', response.status, t);
      return new Response(JSON.stringify({ error: 'AI service error. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('AI proxy error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
