// src/supabaseClient.js
//this is to connect to the database.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwxfjkzsanrumlwhtjyt.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eGZqa3pzYW5ydW1sd2h0anl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MzYyMTUsImV4cCI6MjA0NjUxMjIxNX0.eMNwZvbEiIWnYZgDHtKzaj1aoYKQStFw8n_nMhll3cg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);