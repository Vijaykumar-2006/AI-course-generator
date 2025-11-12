import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ExportRequest {
  courseId: string;
  lessons: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { courseId, lessons }: ExportRequest = await req.json()

    // In a real implementation, this would:
    // 1. Use a library like PptxGenJS to create PowerPoint files
    // 2. Generate slides based on lesson content
    // 3. Apply custom themes and branding
    // 4. Return the generated file as a blob

    // For now, we'll simulate the PowerPoint generation
    const pptContent = {
      slides: lessons.map((lesson, index) => ({
        slideNumber: index + 1,
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        objectives: lesson.learning_objectives
      }))
    }

    // Simulate file generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In production, this would return actual PowerPoint binary data
    const mockPptData = new TextEncoder().encode(JSON.stringify(pptContent))
    
    return new Response(mockPptData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="course-${courseId}.pptx"`
      },
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})