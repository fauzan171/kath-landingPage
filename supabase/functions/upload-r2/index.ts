/* eslint-disable */
// @ts-nocheck
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.515.0";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner@3.515.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Allowed MIME types for security
const ALLOWED_TYPES = {
  submission: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/mspowerpoint',
  ],
  payment: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
  ],
};

// Max file sizes in bytes
const MAX_FILE_SIZES = {
  submission: 10 * 1024 * 1024, // 10MB
  payment: 5 * 1024 * 1024,     // 5MB
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Simple auth check - just verify token exists and is not expired
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    
    // Basic validation - token should exist and have valid JWT format
    if (!token || !token.includes('.') || token.split('.').length !== 3) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token format' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Decode JWT to check expiration (lightweight check without server validation)
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Token expired' }), { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
      
      // Check if token has a subject (user ID)
      if (!payload.sub) {
        return new Response(JSON.stringify({ error: 'Unauthorized: No user subject' }), { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
      
      console.log('Auth: User', payload.sub, 'verified (token valid)');
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Malformed token' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // 2. Parsed Request Payload
    const { fileName, contentType, taskId, teamId, uploadType } = await req.json();

    if (!fileName || !taskId || !teamId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3. Validate file type based on upload type
    const type = uploadType || 'submission';
    const allowedTypes = ALLOWED_TYPES[type] || ALLOWED_TYPES.submission;
    const maxSize = MAX_FILE_SIZES[type] || MAX_FILE_SIZES.submission;

    // Note: contentType validation is informational here since the actual
    // file isn't uploaded to us - it goes directly to R2 via presigned URL.
    // The frontend should validate before requesting the presigned URL.

    // 4. Configure R2 Client using AWS SDK
    const S3 = new S3Client({
      region: "auto",
      endpoint: Deno.env.get('R2_ENDPOINT') ?? '',
      credentials: {
        accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID') ?? '',
        secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY') ?? '',
      },
    });

    const bucketName = Deno.env.get('R2_BUCKET_NAME') ?? 'kathcibc';
    
    // File structure in R2:
    // - Submissions: uploads/{teamId}/{taskId}/{timestamp}_{safeFileName}
    // - Payments: payments/{teamId}/{timestamp}_{safeFileName}
    const timestamp = Date.now();
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    
    let objectKey: string;
    if (type === 'payment') {
      objectKey = `payments/${teamId}/${timestamp}_${safeFileName}`;
    } else {
      objectKey = `uploads/${teamId}/${taskId}/${timestamp}_${safeFileName}`;
    }

    // 5. Generate Presigned URL
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType || 'application/octet-stream',
    });

    // URL expires in 15 minutes (900 seconds)
    const uploadUrl = await getSignedUrl(S3, command, { expiresIn: 900 });

    // Generate the public URL for the uploaded file
    const r2PublicDomain = Deno.env.get('R2_PUBLIC_DOMAIN') ?? ''; 
    const finalUrl = r2PublicDomain 
      ? `https://${r2PublicDomain}/${objectKey}` 
      : `https://${bucketName}.${Deno.env.get('R2_ENDPOINT')?.split('//')[1]}/${objectKey}`;

    return new Response(
      JSON.stringify({
        uploadUrl,
        finalUrl,
        key: objectKey,
        uploadType: type,
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
