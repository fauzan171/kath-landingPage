/* eslint-disable */
// @ts-nocheck
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.515.0";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner@3.515.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const getAllowedOrigin = (req: Request): string => {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigins = [
    'https://katheventorganizer.com',
    'https://www.katheventorganizer.com',
    'https://kath-cibc.andifauzan986.workers.dev',
    'http://localhost:5173', // dev only
    'http://localhost:4173', // preview
  ];
  // If the request origin is allowed, return it; otherwise default to first
  if (allowedOrigins.includes(origin)) return origin;
  // Also allow any *.workers.dev subdomain for Cloudflare deployments
  if (origin.match(/^https:\/\/[a-z0-9-]+\.workers\.dev$/)) return origin;
  return allowedOrigins[0];
};

const getCorsHeaders = (req: Request) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(req),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
});

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

/**
 * Verify JWT token using Supabase Auth API.
 * Performs proper server-side signature verification.
 */
async function verifyAuth(req: Request): Promise<{ userId: string } | null> {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '') || '';

  if (!token || !token.includes('.') || token.split('.').length !== 3) {
    return null;
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('VITE_SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('VITE_SUPABASE_ANON_KEY') ?? '';

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables for auth verification');
      return null;
    }

    // Use Supabase client to verify the token server-side
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth verification failed:', error?.message);
      return null;
    }

    return { userId: user.id };
  } catch (e) {
    console.error('Auth verification error:', e);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 0. Validate required environment variables early to give clear errors
    const r2Endpoint = Deno.env.get('R2_ENDPOINT');
    const r2AccessKey = Deno.env.get('R2_ACCESS_KEY_ID');
    const r2SecretKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('VITE_SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('VITE_SUPABASE_ANON_KEY');

    const missingVars: string[] = [];
    if (!r2Endpoint) missingVars.push('R2_ENDPOINT');
    if (!r2AccessKey) missingVars.push('R2_ACCESS_KEY_ID');
    if (!r2SecretKey) missingVars.push('R2_SECRET_ACCESS_KEY');
    if (!supabaseUrl) missingVars.push('SUPABASE_URL');
    if (!supabaseAnonKey) missingVars.push('SUPABASE_ANON_KEY');

    if (missingVars.length > 0) {
      console.error('Missing required environment variables:', missingVars.join(', '));
      return new Response(JSON.stringify({
        error: `Server configuration error: missing env vars [${missingVars.join(', ')}]. Run: supabase secrets set ${missingVars.map(v => `${v}=...`).join(' ')}`
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 1. Verify authentication using Supabase Auth
    const authResult = await verifyAuth(req);
    if (!authResult) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    console.log('Auth: User', authResult.userId, 'verified (token valid)');

    // 2. Handle DELETE requests for file removal
    if (req.method === 'DELETE') {
      const { key } = await req.json();
      if (!key) {
        return new Response(JSON.stringify({ error: 'Missing file key' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Ownership validation: only allow deleting files that belong to the authenticated user's team
      const keyParts = key.split('/');
      const keyTeamId = keyParts[1]; // uploads/{teamId}/... or payments/{teamId}/...
      if (keyTeamId && keyTeamId !== authResult.userId) {
        // Verify user is member of the team that owns this file
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data: membership } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', authResult.userId)
          .eq('team_id', keyTeamId)
          .maybeSingle();

        if (!membership) {
          return new Response(JSON.stringify({ error: 'Forbidden: You do not own this file' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      const S3 = new S3Client({
        region: "auto",
        endpoint: Deno.env.get('R2_ENDPOINT') ?? '',
        credentials: {
          accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID') ?? '',
          secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY') ?? '',
        },
      });

      const bucketName = Deno.env.get('R2_BUCKET_NAME') ?? 'kathcibc';

      await S3.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }));

      console.log('File deleted:', key);
      return new Response(JSON.stringify({ success: true, key }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. Handle POST requests for presigned upload URLs
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { fileName, contentType, fileSize, taskId, teamId, uploadType } = await req.json();

    if (!fileName || !taskId || !teamId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 4. Validate file type based on upload type
    const type = uploadType || 'submission';
    const allowedTypes = ALLOWED_TYPES[type] || ALLOWED_TYPES.submission;
    const maxSize = MAX_FILE_SIZES[type] || MAX_FILE_SIZES.submission;

    // Enforce MIME type validation
    if (!contentType || !allowedTypes.includes(contentType)) {
      return new Response(JSON.stringify({
        error: `Invalid file type: ${contentType}. Allowed: ${allowedTypes.join(', ')}`
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Enforce file size validation
    if (fileSize && fileSize > maxSize) {
      return new Response(JSON.stringify({
        error: `File too large: ${(fileSize / 1024 / 1024).toFixed(1)}MB. Max: ${maxSize / 1024 / 1024}MB`
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 5. Configure R2 Client using AWS SDK (vars already validated above)
    const S3 = new S3Client({
      region: "auto",
      endpoint: r2Endpoint!,
      credentials: {
        accessKeyId: r2AccessKey!,
        secretAccessKey: r2SecretKey!,
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

    // 6. Generate Presigned URL
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
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
