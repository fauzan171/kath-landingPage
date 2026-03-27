# 03 - Backend Authentication System

## 🎯 Objective
Implementasi authentication system dengan JWT untuk login, logout, refresh token, dan get current user.

## 📋 Context
Sistem autentikasi untuk CIBC Admin Dashboard dengan:
- **Login**: Email + Password → Access Token (15 min) + Refresh Token (7 days)
- **Token**: JWT dengan httpOnly cookie untuk refresh
- **Roles**: super_admin, admin, judge, observer
- **Middleware**: Auth verification untuk protected routes

---

## 🛠️ Task

### 1. Create Auth Service

File: `src/services/auth.service.ts`

```typescript
import type { User, JWTPayload } from '../types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { verifyPassword } from '../utils/password';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  };
  competitions: Array<{
    id: string;
    code: string;
    name: string;
    role: string;
  }>;
}

export class AuthService {
  constructor(private db: D1Database) {}

  /**
   * Login dengan email & password
   */
  async login(input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input;

    // 1. Get user by email
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 2. Check if user is active
    if (!user.is_active) {
      throw new Error('USER_INACTIVE');
    }

    // 3. Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 4. Get user roles & competitions
    const userRoles = await this.getUserRoles(user.id);

    // 5. Generate tokens
    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: userRoles[0]?.role || 'admin',
      permissions: userRoles[0]?.permissions || ['read', 'write'],
      competitionId: userRoles[0]?.competition_id,
    };

    const accessToken = await generateAccessToken(jwtPayload);
    const refreshToken = await generateRefreshToken(user.id);

    // 6. Update last login
    await this.updateLastLogin(user.id);

    // 7. Prepare response
    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: jwtPayload.role,
        permissions: jwtPayload.permissions,
      },
      competitions: userRoles.map((r) => ({
        id: r.competition_id,
        code: r.competition_code,
        name: r.competition_name,
        role: r.role,
      })),
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    // 1. Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    // 2. Get user
    const user = await this.getUserById(payload.userId);
    if (!user || !user.is_active) {
      throw new Error('USER_NOT_FOUND');
    }

    // 3. Get user roles
    const userRoles = await this.getUserRoles(user.id);

    // 4. Generate new access token
    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: userRoles[0]?.role || 'admin',
      permissions: userRoles[0]?.permissions || ['read', 'write'],
      competitionId: userRoles[0]?.competition_id,
    };

    const accessToken = await generateAccessToken(jwtPayload);

    return {
      accessToken,
      expiresIn: 900,
    };
  }

  /**
   * Logout (invalidate refresh token)
   * Note: JWT is stateless, so we rely on client to delete tokens
   * Optional: Add token blacklist with KV storage
   */
  async logout(userId: string): Promise<void> {
    // Optional: Add to blacklist
    // await KV.put(`logout:${userId}:${Date.now()}`, '1', { expirationTtl: 604800 });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar_url?: string;
    role: string;
    permissions: string[];
    competitions: Array<{
      id: string;
      code: string;
      name: string;
      role: string;
    }>;
  }> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const userRoles = await this.getUserRoles(user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      role: userRoles[0]?.role || 'admin',
      permissions: userRoles[0]?.permissions || ['read', 'write'],
      competitions: userRoles.map((r) => ({
        id: r.competition_id,
        code: r.competition_code,
        name: r.competition_name,
        role: r.role,
      })),
    };
  }

  // ========== Helper Methods ==========

  private async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const { results } = await this.db.prepare(query).bind(email).all();
    return (results?.[0] as User) || null;
  }

  private async getUserById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';
    const { results } = await this.db.prepare(query).bind(id).all();
    return (results?.[0] as User) || null;
  }

  private async getUserRoles(userId: string): Promise<
    Array<{
      role: string;
      permissions: string[];
      competition_id: string;
      competition_code: string;
      competition_name: string;
    }>
  > {
    const query = `
      SELECT 
        ur.role,
        ur.permissions,
        ur.competition_id,
        c.code as competition_code,
        c.name as competition_name
      FROM user_roles ur
      LEFT JOIN competitions c ON ur.competition_id = c.id
      WHERE ur.user_id = ?
      ORDER BY 
        CASE ur.role 
          WHEN 'super_admin' THEN 1 
          WHEN 'admin' THEN 2 
          WHEN 'judge' THEN 3 
          ELSE 4 
        END
    `;
    const { results } = await this.db.prepare(query).bind(userId).all();
    
    return (results || []).map((r: any) => ({
      ...r,
      permissions: r.permissions ? JSON.parse(r.permissions) : ['read', 'write'],
    }));
  }

  private async updateLastLogin(userId: string): Promise<void> {
    const query = 'UPDATE users SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await this.db.prepare(query).bind(userId).run();
  }
}
```

---

### 2. Create Auth Controller

File: `src/controllers/auth.controller.ts`

```typescript
import { Context } from 'hono';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';
import type { JWTPayload } from '../types';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /api/v1/auth/login
   */
  async login = async (c: Context) => {
    try {
      const body = await c.req.json();
      const { email, password } = body;

      // Validation
      if (!email || !password) {
        return errorResponse('VALIDATION_ERROR', 'Email and password are required');
      }

      if (!email.includes('@')) {
        return errorResponse('VALIDATION_ERROR', 'Invalid email format');
      }

      // Login
      const result = await this.authService.login({ email, password });

      // Set refresh token as httpOnly cookie
      c.header('Set-Cookie', `refreshToken=${result.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);

      // Remove refreshToken from response
      const { refreshToken, ...response } = result;

      return successResponse(response, {
        message: 'Login successful',
      });
    } catch (error: any) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return errorResponse('INVALID_CREDENTIALS', 'Email atau password salah', [], 401);
      }
      if (error.message === 'USER_INACTIVE') {
        return errorResponse('USER_INACTIVE', 'User account is inactive', [], 403);
      }
      console.error('Login error:', error);
      return errorResponse('INTERNAL_ERROR', 'An error occurred during login', [], 500);
    }
  };

  /**
   * POST /api/v1/auth/refresh
   */
  async refresh = async (c: Context) => {
    try {
      // Get refresh token from cookie
      const refreshToken = c.req.header('Cookie')
        ?.split(';')
        .find((c) => c.trim().startsWith('refreshToken='))
        ?.split('=')[1];

      if (!refreshToken) {
        return errorResponse('UNAUTHORIZED', 'Refresh token not found', [], 401);
      }

      const result = await this.authService.refreshToken(refreshToken);

      return successResponse(result, {
        message: 'Token refreshed successfully',
      });
    } catch (error: any) {
      if (error.message === 'INVALID_REFRESH_TOKEN') {
        return errorResponse('UNAUTHORIZED', 'Invalid refresh token', [], 401);
      }
      if (error.message === 'USER_NOT_FOUND') {
        return errorResponse('UNAUTHORIZED', 'User not found', [], 401);
      }
      console.error('Refresh error:', error);
      return errorResponse('INTERNAL_ERROR', 'An error occurred', [], 500);
    }
  };

  /**
   * POST /api/v1/auth/logout
   */
  async logout = async (c: Context) => {
    try {
      const user = c.get('user') as JWTPayload;

      await this.authService.logout(user.userId);

      // Clear refresh token cookie
      c.header('Set-Cookie', 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');

      return successResponse(null, {
        message: 'Logout successful',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      return errorResponse('INTERNAL_ERROR', 'An error occurred', [], 500);
    }
  };

  /**
   * GET /api/v1/auth/me
   */
  async me = async (c: Context) => {
    try {
      const user = c.get('user') as JWTPayload;

      const profile = await this.authService.getCurrentUser(user.userId);

      return successResponse(profile);
    } catch (error: any) {
      if (error.message === 'USER_NOT_FOUND') {
        return errorResponse('NOT_FOUND', 'User not found', [], 404);
      }
      console.error('Get user error:', error);
      return errorResponse('INTERNAL_ERROR', 'An error occurred', [], 500);
    }
  };
}
```

---

### 3. Register Routes

File: `src/index.ts` (update)

```typescript
import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors';
import { authMiddleware } from './middleware/auth';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
  FRONTEND_URL: string;
};

type Variables = {
  user: any;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middleware
corsMiddleware(app);

// Initialize services
const authService = new AuthService(app.env.DB);
const authController = new AuthController(authService);

// Health check
app.get('/api/v1/admin/health', (c) => {
  return c.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: 'development',
    },
  });
});

// Auth routes
app.post('/api/v1/auth/login', authController.login);
app.post('/api/v1/auth/refresh', authController.refresh);
app.post('/api/v1/auth/logout', authMiddleware, authController.logout);
app.get('/api/v1/auth/me', authMiddleware, authController.me);

// ... existing routes

export default app;
```

---

### 4. Update Auth Middleware

File: `src/middleware/auth.ts` (update types)

```typescript
import { Context } from 'hono';
import { verifyAccessToken } from '../utils/jwt';
import type { JWTPayload } from '../types';

declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } },
      401
    );
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyAccessToken(token);

  if (!payload) {
    return c.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
      401
    );
  }

  // Attach user to context
  c.set('user', payload);
  
  await next();
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: () => Promise<void>) => {
    const user = c.get('user') as JWTPayload;
    
    if (!roles.includes(user.role)) {
      return c.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        403
      );
    }
    
    await next();
  };
}

export function requirePermission(...permissions: string[]) {
  return async (c: Context, next: () => Promise<void>) => {
    const user = c.get('user') as JWTPayload;
    
    const hasPermission = permissions.some((p) => user.permissions.includes(p));
    if (!hasPermission) {
      return c.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        403
      );
    }
    
    await next();
  };
}
```

---

### 5. Add User Roles Table to Migration

File: `migrations/001_initial_schema.sql` (add)

```sql
-- User roles table (add to existing migrations)
CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competition_id TEXT REFERENCES competitions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'judge', 'observer')),
  permissions TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_competition ON user_roles(competition_id);
```

File: `migrations/002_seed_data.sql` (update)

```sql
-- Add admin role for default user
INSERT INTO user_roles (id, user_id, competition_id, role, permissions)
VALUES (
  'ur_001',
  'user_admin_001',
  'comp_cibc_2026',
  'super_admin',
  '["read", "write", "delete", "grade"]'
);
```

---

### 6. Test Authentication

Create test file: `tests/auth.test.ts` (optional)

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Authentication', () => {
  const BASE_URL = 'http://localhost:8787';

  it('should login with valid credentials', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@kathevent.com',
        password: 'admin123',
      }),
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('accessToken');
    expect(data.data.user.email).toBe('admin@kathevent.com');
  });

  it('should reject invalid credentials', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@kathevent.com',
        password: 'wrongpassword',
      }),
    });

    const data = await response.json();
    
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should refresh token', async () => {
    // First login
    const loginResponse = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@kathevent.com',
        password: 'admin123',
      }),
    });

    const loginData = await loginResponse.json();
    const refreshToken = loginData.data.refreshToken;

    // Refresh
    const refreshResponse = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${refreshToken}`,
      },
    });

    const refreshData = await refreshResponse.json();
    
    expect(refreshResponse.status).toBe(200);
    expect(refreshData.success).toBe(true);
    expect(refreshData.data).toHaveProperty('accessToken');
  });

  it('should get current user', async () => {
    // First login
    const loginResponse = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@kathevent.com',
        password: 'admin123',
      }),
    });

    const loginData = await loginResponse.json();
    const accessToken = loginData.data.accessToken;

    // Get user
    const meResponse = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const meData = await meResponse.json();
    
    expect(meResponse.status).toBe(200);
    expect(meData.success).toBe(true);
    expect(meData.data.email).toBe('admin@kathevent.com');
  });
});
```

---

## ✅ Deliverables

- [ ] Auth service dengan login, refresh, logout, getCurrentUser
- [ ] Auth controller dengan error handling
- [ ] Routes registered di index.ts
- [ ] Auth middleware dengan type safety
- [ ] User roles table di database
- [ ] Seed data untuk admin user
- [ ] Test authentication flow

---

## 🧪 Manual Testing

```bash
# 1. Login
curl -X POST http://localhost:8787/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kathevent.com","password":"admin123"}'

# 2. Get current user (gunakan accessToken dari response)
curl http://localhost:8787/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. Refresh token (gunakan refreshToken dari cookie atau response)
curl -X POST http://localhost:8787/api/v1/auth/refresh \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN"

# 4. Logout
curl -X POST http://localhost:8787/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔒 Security Notes

1. **Password Hash**: Gunakan bcrypt dengan salt rounds = 10
2. **Token Expiry**: Access token 15 menit, Refresh token 7 hari
3. **HttpOnly Cookie**: Refresh token disimpan di httpOnly cookie
4. **HTTPS**: Required di production
5. **Rate Limiting**: Implementasi di `/auth/login` (5 req/min)

---

**Next Prompt**: `04-backend-competition.md` - Competition & Stage API
