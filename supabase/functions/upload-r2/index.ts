/* eslint-disable */
// @ts-nocheck
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.515.0";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner@3.515.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user checking Supabase tokens
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 2. Parsed Request Payload
    const { fileName, contentType, taskId, teamId } = await req.json();

    if (!fileName || !taskId || !teamId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3. Configure R2 Client using AWS SDK
    const S3 = new S3Client({
      region: "auto",
      endpoint: Deno.env.get('R2_ENDPOINT') ?? '',
      credentials: {
        accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID') ?? '',
        secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY') ?? '',
      },
    });

    const bucketName = Deno.env.get('R2_BUCKET_NAME') ?? 'kath-events';
    
    // File structure in R2: competition_id/team_id/timestamp_filename
    const timestamp = Date.now();
    // Normalize filename (remove spaces, special chars that might break URLs)
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const objectKey = `uploads/${teamId}/${taskId}/${timestamp}_${safeFileName}`;

    // 4. Generate Presigned URL
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType || 'application/octet-stream',
    });

    // URL expires in 15 minutes (900 seconds)
    const uploadUrl = await getSignedUrl(S3, command, { expiresIn: 900 });

    // Assuming we use a custom domain or default public URL for the final readout if bucket is public,
    // Or we just store the key and fetch via presigned-read url later. 
    // Here we generate the expected public URL formatting (assuming mapped custom domain or public bucket)
    const r2PublicDomain = Deno.env.get('R2_PUBLIC_DOMAIN') ?? ''; 
    const finalUrl = r2PublicDomain ? `https://${r2PublicDomain}/${objectKey}` : `https://${bucketName}.${Deno.env.get('R2_ENDPOINT')?.split('//')[1]}/${objectKey}`;

    return new Response(
      JSON.stringify({
        uploadUrl,
        finalUrl,
        key: objectKey
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
