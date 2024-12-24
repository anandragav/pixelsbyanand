import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the webhook payload
    const payload = await req.json()
    console.log('Received webhook payload:', payload)

    // Only process new file uploads
    if (payload.type !== 'INSERT' || !payload.record) {
      return new Response(JSON.stringify({ message: 'Not a new file upload' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    const record = payload.record
    const filePath = record.name
    const category = filePath.split('/')[0].toLowerCase()
    const fileName = filePath.split('/')[1]
    const title = fileName.split('.')[0]

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Construct the public URL
    const publicUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/images/${filePath}`

    // Insert into images table
    const { data, error } = await supabase
      .from('images')
      .insert({
        title: title,
        category: category,
        url: publicUrl,
        alt: title,
        aspect_ratio: 'landscape' // Default to landscape, you might want to detect this
      })
      .select()

    if (error) {
      console.error('Error inserting image:', error)
      throw error
    }

    console.log('Successfully added image to database:', data)

    return new Response(
      JSON.stringify({ message: 'Successfully processed new image' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})