import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, prompt, content } = await req.json();

    if (!action) {
      return Response.json({ error: 'action is required' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'generate': {
        // Generate blog post from prompt
        if (!prompt) {
          return Response.json({ error: 'prompt is required for generation' }, { status: 400 });
        }

        result = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a professional blog writer. Generate a complete blog post based on this prompt: "${prompt}".

Include:
- A compelling title
- An engaging introduction
- Well-structured body content with sections
- A strong conclusion
- Format the content in markdown

Write in a professional yet conversational tone. Make it informative and engaging.`,
        });
        break;
      }

      case 'rewrite': {
        // Rewrite existing content
        if (!content) {
          return Response.json({ error: 'content is required for rewriting' }, { status: 400 });
        }

        result = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a professional editor. Rewrite the following blog post content to improve clarity, tone, and readability. Keep the core message but make it more engaging and professional. Format in markdown:

${content}`,
        });
        break;
      }

      case 'generateSEO': {
        // Generate tags and meta description
        if (!content) {
          return Response.json({ error: 'content is required for SEO generation' }, { status: 400 });
        }

        result = await base44.integrations.Core.InvokeLLM({
          prompt: `Based on this blog post content, generate SEO metadata:

${content}

Provide:
1. 5-8 relevant tags (single words or short phrases)
2. A compelling meta description (150-160 characters)
3. An excerpt (2-3 sentences summarizing the post)`,
          response_json_schema: {
            type: 'object',
            properties: {
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: '5-8 relevant tags'
              },
              metaDescription: {
                type: 'string',
                description: 'Meta description (150-160 chars)'
              },
              excerpt: {
                type: 'string',
                description: '2-3 sentence excerpt'
              }
            },
            required: ['tags', 'metaDescription', 'excerpt']
          }
        });
        break;
      }

      case 'generateTitle': {
        // Generate title from content
        if (!content) {
          return Response.json({ error: 'content is required for title generation' }, { status: 400 });
        }

        result = await base44.integrations.Core.InvokeLLM({
          prompt: `Based on this blog post content, generate 5 compelling title options that are SEO-friendly and engaging:

${content}`,
          response_json_schema: {
            type: 'object',
            properties: {
              titles: {
                type: 'array',
                items: { type: 'string' },
                description: '5 title options'
              }
            },
            required: ['titles']
          }
        });
        break;
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    return Response.json({ success: true, result });

  } catch (error) {
    console.error('Blog AI error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});