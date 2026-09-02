// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejar la petición OPTIONS de verificación previa que hace el navegador
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { book_id } = await req.json()
    if (!book_id) {
      return new Response(JSON.stringify({ error: "Se requiere un book_id" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('book_id', book_id)

    if (reviewsError) throw reviewsError

    if (!reviews || reviews.length === 0) {
      return new Response(JSON.stringify({ average_rating: 0, total_reviews: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const suma = reviews.reduce((acc, curr) => acc + curr.rating, 0)
    const promedio = suma / reviews.length

    return new Response(
      JSON.stringify({ book_id, average_rating: parseFloat(promedio.toFixed(1)), total_reviews: reviews.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})