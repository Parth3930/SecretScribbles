import { createClient } from "@supabase/supabase-js";

const database_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anyonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(database_url, anyonKey);

export default supabase;
