import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mzouiorqhravqybadngk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b3Vpb3JxaHJhdnF5YmFkbmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTEyNTgsImV4cCI6MjA0OTc2NzI1OH0.tCgvbmfSaRk7_GtN7v40ypcSyNGoEnGqSaFtCs0h004';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);