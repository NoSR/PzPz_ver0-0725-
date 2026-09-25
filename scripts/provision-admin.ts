import { createPasswordHash } from '../functions/lib/auth';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running this command.');
}

if (email.length > 254 || password.length < 12) {
  throw new Error('Use a valid email address and a password with at least 12 characters.');
}

const escapeSql = (value: string): string => value.replaceAll("'", "''");
const { hash, salt } = await createPasswordHash(password);
const id = crypto.randomUUID();

console.log(`INSERT INTO admins (id, email, password_hash, password_salt) VALUES ('${id}', '${escapeSql(email)}', '${hash}', '${salt}');`);