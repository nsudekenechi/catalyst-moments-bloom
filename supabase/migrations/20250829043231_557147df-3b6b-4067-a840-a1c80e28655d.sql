-- Update supabase config to make bland-voice-agent public
UPDATE supabase.functions 
SET verify_jwt = false 
WHERE name = 'bland-voice-agent';