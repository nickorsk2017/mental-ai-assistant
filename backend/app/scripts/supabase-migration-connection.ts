import * as dns from 'dns/promises';
import { Client, type ClientConfig } from 'pg';

function resolveSslForConnectionString(connectionString: string): ClientConfig['ssl'] | undefined {
  if (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) {
    return undefined;
  }

  if (connectionString.includes('sslmode=disable')) {
    return undefined;
  }

  return { rejectUnauthorized: false };
}

function isLocalDatabaseHost(hostname: string): boolean {
  const lowered = hostname.toLowerCase();

  return lowered === 'localhost' || lowered === '127.0.0.1' || lowered.endsWith('.internal');
}

function isSupabaseDirectDatabaseHost(hostname: string): boolean {
  const lowered = hostname.toLowerCase();

  return lowered.startsWith('db.') && lowered.endsWith('.supabase.co');
}

function tryParseHostname(connectionString: string): string | null {
  try {
    const normalizedUrlString = connectionString.trim().replace(/^postgresql:/i, 'postgres:');

    return new URL(normalizedUrlString).hostname || null;
  } catch {
    return null;
  }
}

function readNetworkErrorCode(error: unknown): string | undefined {
  let current: unknown = error;

  for (let depth = 0; depth < 6 && current !== undefined && current !== null; depth += 1) {
    if (typeof current === 'object' && current !== null && 'code' in current) {
      const code = (current as { code?: unknown }).code;

      if (typeof code === 'string' && code.length > 0) {
        return code;
      }
    }

    if (typeof current === 'object' && current !== null && 'cause' in current) {
      current = (current as { cause: unknown }).cause;
      continue;
    }

    break;
  }

  return undefined;
}

function formatBriefError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function resolveConnectTimeoutMillis(): number {
  const rawValue = process.env.SUPABASE_MIGRATE_CONNECT_TIMEOUT_MS;
  const parsedValue = rawValue ? Number(rawValue) : Number.NaN;

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 25000;
}

function buildClientConfigFromConnectionUrl(
  connectionUrl: string,
  hostOverride: string,
  connectionTimeoutMillis: number,
): ClientConfig {
  const normalizedUrlString = connectionUrl.trim().replace(/^postgresql:/i, 'postgres:');
  const parsedUrl = new URL(normalizedUrlString);

  const databaseFromPath = parsedUrl.pathname.replace(/^\//, '').split('/')[0];
  const portNumber = parsedUrl.port ? Number(parsedUrl.port) : 5432;

  return {
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    host: hostOverride,
    port: portNumber,
    database: databaseFromPath || undefined,
    ssl: resolveSslForConnectionString(connectionUrl),
    connectionTimeoutMillis,
  };
}

export function isConnectionRetryable(error: unknown): boolean {
  const code = readNetworkErrorCode(error);

  if (code && ['EAI_AGAIN', 'ECONNRESET', 'EHOSTUNREACH', 'ENETUNREACH', 'ENOTFOUND', 'ETIMEDOUT'].includes(code)) {
    return true;
  }

  if (error instanceof Error && /timeout/i.test(error.message)) {
    return true;
  }

  return false;
}

export function formatMigrationFailureHint(connectionString: string): string {
  if (connectionString.includes('pooler.supabase.com') || connectionString.includes(':6543')) {
    return '';
  }

  return [
    '',
    'If connections keep failing, set SUPABASE_MIGRATE_DB_URL to the Session pooler URI',
    '(Supabase Dashboard → Project Settings → Database → Connection string → Session mode).',
    'Direct db.*.supabase.co:5432 often fails from some networks (IPv6 or firewall).',
  ].join('\n');
}

export async function connectMigrationClient(connectionString: string): Promise<Client> {
  const connectionTimeoutMillis = resolveConnectTimeoutMillis();
  const sslConfiguration = resolveSslForConnectionString(connectionString);
  const hostname = tryParseHostname(connectionString);
  const preferIpv4First =
    process.env.SUPABASE_MIGRATE_PREFER_IPV4 !== 'false' &&
    Boolean(hostname && isSupabaseDirectDatabaseHost(hostname) && !isLocalDatabaseHost(hostname));

  if (preferIpv4First && hostname) {
    try {
      const { address } = await dns.lookup(hostname, { family: 4 });
      const ipv4FirstClient = new Client(
        buildClientConfigFromConnectionUrl(connectionString, address, connectionTimeoutMillis),
      );

      await ipv4FirstClient.connect();

      return ipv4FirstClient;
    } catch (ipv4FirstError: unknown) {
      if (isConnectionRetryable(ipv4FirstError)) {
        throw ipv4FirstError;
      }

      console.warn(
        `IPv4-first connection failed for ${hostname} (${formatBriefError(ipv4FirstError)}); using default host resolution.`,
      );
    }
  }

  const initialClient = new Client({
    connectionString,
    ssl: sslConfiguration,
    connectionTimeoutMillis,
  });

  try {
    await initialClient.connect();

    return initialClient;
  } catch (firstConnectionError: unknown) {
    await initialClient.end().catch(() => {});

    if (!isConnectionRetryable(firstConnectionError)) {
      throw firstConnectionError;
    }

    if (!hostname || isLocalDatabaseHost(hostname)) {
      throw firstConnectionError;
    }

    let ipv4Address: string;

    try {
      const lookupResult = await dns.lookup(hostname, { family: 4 });

      ipv4Address = lookupResult.address;
    } catch {
      throw firstConnectionError;
    }

    console.warn(
      `Retrying with IPv4 (${ipv4Address}) for host ${hostname} after the first connection attempt failed.`,
    );

    const ipv4Client = new Client(
      buildClientConfigFromConnectionUrl(connectionString, ipv4Address, connectionTimeoutMillis),
    );

    await ipv4Client.connect();

    return ipv4Client;
  }
}
