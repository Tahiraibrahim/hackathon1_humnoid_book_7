import crypto from 'crypto';

/**
 * Hash password using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}$${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split('$');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

/**
 * Generate a simple JWT-like token (NOT production-ready)
 * In production, use proper JWT libraries
 */
export function generateToken(payload: any): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payloadStr = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days
  })).toString('base64');

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payloadStr}`)
    .digest('base64');

  return `${header}.${payloadStr}.${signature}`;
}

/**
 * Verify token
 */
export function verifyToken(token: string): any {
  try {
    const [header, payload, signature] = token.split('.');

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
