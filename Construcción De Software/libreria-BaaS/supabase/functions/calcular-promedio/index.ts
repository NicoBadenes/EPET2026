// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // 1. Recibimos el book_id desde el cliente
    const { book_id } = await req.json()
    if (!book_id) {
      return new Response(JSON.stringify({ error: "Se requiere un book_id" }), { status: 400 })
    }

    // 2. Creamos un cliente de Supabase usando las credenciales del servidor
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Consultamos todas las reseñas asociadas a ese libro
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('book_id', book_id)

    if (reviewsError) throw reviewsError

    if (!reviews || reviews.length === 0) {
      return new Response(JSON.stringify({ average: 0, total_reviews: 0 }), { status: 200 })
    }

    // 4. Calculamos el promedio matemático
    const suma = reviews.reduce((acc, curr) => acc + curr.rating, 0)
    const promedio = suma / reviews.length

    // 5. Devolvemos el resultado procesado
    return new Response(
      JSON.stringify({ book_id, average_rating: parseFloat(promedio.toFixed(1)), total_reviews: reviews.length }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})