import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const sinEnv = !supabaseUrl || !supabaseAnonKey

if (sinEnv) {
  console.warn('⚠️ VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están definidas. Revisa las variables de entorno en Vercel.')
}

function mockChain(): any {
  const q = new Promise<any>((resolve) => resolve({ data: [], error: null }))
  return Object.assign(q, {
    select: () => mockChain(),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => mockChain(),
    eq: () => mockChain(),
    order: () => mockChain(),
  })
}

export const supabase = sinEnv
  ? ({ from: () => mockChain() } as unknown as ReturnType<typeof createClient>)
  : createClient(supabaseUrl, supabaseAnonKey)
