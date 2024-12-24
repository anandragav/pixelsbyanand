import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'

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

    // Download the original image
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('images')
      .download(filePath)

    if (downloadError) {
      throw downloadError
    }

    // Convert the file to an ArrayBuffer
    const arrayBuffer = await fileData.arrayBuffer()

    // Load the image using ImageScript
    const image = await Image.decode(new Uint8Array(arrayBuffer))

    // Add watermark text
    const watermarkText = '© My Gallery'
    const fontSize = Math.min(image.width, image.height) * 0.05 // 5% of the smallest dimension
    
    // Add semi-transparent white text in the bottom right corner
    image.drawText(
      watermarkText,
      Math.floor(fontSize),
      {
        x: image.width - (watermarkText.length * fontSize * 0.6),
        y: image.height - (fontSize * 1.5),
        color: Image.rgbaToColor(255, 255, 255, 0.7)
      }
    )

    // Encode the image back to PNG
    const processedImageData = await image.encode()

    // Upload the watermarked image back to storage
    const { error: uploadError } = await supabase
      .storage
      .from('images')
      .update(filePath, processedImageData, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    // Insert into images table
    const { error: dbError } = await supabase
      .from('images')
      .insert({
        title: title,
        category: category,
        url: publicUrl,
        alt: title,
        aspect_ratio: 'landscape', // Default to landscape, you might want to detect this
      })

    if (dbError) {
      throw dbError
    }

    return new Response(
      JSON.stringify({ message: 'Successfully processed image with watermark' }),
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