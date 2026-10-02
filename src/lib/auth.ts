const EXPECTED_PASSWORD = '9Ux-VJ?#VGC8m?V9';

export function verifyAdminPassword(password: unknown): boolean {
  if (typeof password !== 'string' || !password) return false;
  const submitted = password.trim();
  const envPass = process.env.ADMIN_PASSWORD?.trim();

  // 1. Direct match with user's admin password
  if (submitted === EXPECTED_PASSWORD) {
    return true;
  }

  // 2. Match with server environment variable if set
  if (envPass && submitted === envPass) {
    return true;
  }

  // 3. Match if unquoted '#' in .env caused truncation to '9Ux-VJ?'
  if (envPass === '9Ux-VJ?' && submitted === EXPECTED_PASSWORD) {
    return true;
  }

  return false;
}
