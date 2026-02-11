/**
 * Database Configuration and Tenant Management
 * 
 * This module handles multi-tenancy with schema-per-tenant architecture using Prisma.
 * 
 * Architecture:
 * - Admin database tracks all tenants and their schema names
 * - Each tenant gets their own schema (e.g., tenant_abc123)
 * - Connection switching is handled via PostgreSQL search_path
 */

import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Prisma Client instance for admin database operations
 * Used for tenant management, authentication, and cross-tenant queries
 */
let prismaAdmin: PrismaClient;

/**
 * Map to cache tenant-specific Prisma clients
 * Each tenant gets their own client configured for their schema
 */
const tenantClients: Map<string, PrismaClient> = new Map();

/**
 * Initialize the admin Prisma client
 * This connects to the admin database for tenant configuration
 */
function getAdminClient(): PrismaClient {
  if (!prismaAdmin) {
    const databaseUrl = process.env.DATABASE_ADMIN_URL || process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_ADMIN_URL or DATABASE_URL environment variable is required');
    }
    
    // Create a connection pool for the admin database
    const pool = new Pool({
      connectionString: databaseUrl,
    });
    
    // Create the Prisma adapter using the pool
    const adapter = new PrismaPg(pool);
    
    prismaAdmin = new PrismaClient({
      adapter,
    });
  }
  return prismaAdmin;
}

/**
 * Get a Prisma client for a specific tenant
 * 
 * In schema-per-tenant architecture, this client will connect to:
 * - Same database as admin client
 * - But with search_path set to the tenant's schema
 * 
 * Note: In Prisma v7, connection pools are managed via PrismaPg adapter
 * Switching between tenant schemas is done via raw SQL: SET search_path TO 'schema_name';
 * 
 * @param tenantId - The tenant identifier
 * @returns Prisma client configured for the tenant's schema
 */
function getTenantClient(tenantId: string): PrismaClient {
  if (!tenantClients.has(tenantId)) {
    /**
     * TODO: Modify this approach based on your PostgreSQL setup
     * 
     * OPTION 1: Schema-per-Tenant (Recommended)
     * - Query the admin database to get the tenant's schema name
     * - Use a custom Prisma raw query to set search_path
     * - This allows multiple tenants in the same database
     * 
     * OPTION 2: Database-per-Tenant (Alternative URL per tenant)
     * - Build the connection string using the tenant ID
     * - May require separate database connections
     * 
     * OPTION 3: Connection Pool per Tenant
     * - Use a connection pooler like PgBouncer
     * - Maintain separate connection strings per schema
     */

    const databaseUrl = process.env.DATABASE_TENANT_URL?.replace(
      '{tenant_id}',
      tenantId
    ) || process.env.DATABASE_ADMIN_URL || process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE URL is required');
    }

    // Create a connection pool for this tenant
    const pool = new Pool({
      connectionString: databaseUrl,
    });

    // Create the Prisma adapter using the pool
    const adapter = new PrismaPg(pool);

    const client = new PrismaClient({
      adapter,
    });

    tenantClients.set(tenantId, client);
  }

  return tenantClients.get(tenantId)!;
}

/**
 * Get the current tenant ID from the execution context
 * 
 * TODO: Implement proper tenant detection based on:
 * - NextAuth session
 * - JWT token in request headers
 * - Request context (headers, cookies)
 * - Environment variable (current fallback)
 * 
 * @returns The current tenant identifier
 */
function getCurrentTenantId(): string {
  // Fallback to environment variable during development
  return process.env.CURRENT_TENANT_ID || 'default_tenant';
}

/**
 * Get Prisma client for the current tenant context
 * 
 * @returns Prisma client configured for current tenant
 */
function getCurrentTenantClient(): PrismaClient {
  const tenantId = getCurrentTenantId();
  return getTenantClient(tenantId);
}

/**
 * Switch to a specific tenant context
 * 
 * TODO: Implement proper context switching:
 * - Verify user has access to the tenant
 * - Update session/auth state
 * - Clear cached data from previous tenant
 * 
 * @param tenantId - Tenant to switch to
 */
async function switchTenant(tenantId: string): Promise<void> {
  // Validate tenant exists in admin database
  const adminClient = getAdminClient();
  const tenant = await adminClient.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant || !tenant.isActive) {
    throw new Error(`Tenant ${tenantId} not found or is inactive`);
  }

  // Update current tenant context
  process.env.CURRENT_TENANT_ID = tenantId;

  // TODO: Update session/auth context here
}

/**
 * Create a new tenant and their schema
 * 
 * Steps:
 * 1. Create tenant record in admin database
 * 2. Create new schema for the tenant (raw SQL)
 * 3. Run migrations for the new schema
 * 
 * @param tenantData - Tenant configuration
 * @returns Created tenant
 */
async function createTenant(tenantData: { name: string; schemaName: string }) {
  const adminClient = getAdminClient();

  try {
    // 1. Create tenant record
    const tenant = await adminClient.tenant.create({
      data: {
        name: tenantData.name,
        schemaName: tenantData.schemaName,
      },
    });

    // 2. Create schema for tenant
    // TODO: Implement raw SQL to create schema
    // await adminClient.$executeRawUnsafe(
    //   `CREATE SCHEMA IF NOT EXISTS "${tenantData.schemaName}";`
    // );

    // 3. Run migrations for new schema
    // TODO: Run Prisma migrations for the new tenant schema

    console.log(`Tenant created: ${tenant.id} in schema: ${tenant.schemaName}`);
    return tenant;
  } catch (error) {
    console.error('Failed to create tenant:', error);
    throw error;
  }
}

/**
 * Clean up database connections
 * Call this on application shutdown
 */
async function disconnectAll(): Promise<void> {
  if (prismaAdmin) {
    await prismaAdmin.$disconnect();
    prismaAdmin = null as any;
  }

  for (const [tenantId, client] of tenantClients.entries()) {
    await client.$disconnect();
  }
  tenantClients.clear();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await disconnectAll();
  process.exit(0);
});

// Export database utilities
export {
  getAdminClient,
  getTenantClient,
  getCurrentTenantId,
  getCurrentTenantClient,
  switchTenant,
  createTenant,
  disconnectAll,
  // Re-export Prisma types
  PrismaClient,
};

/**
 * Multi-Tenancy Implementation Checklist:
 * 
 * [ ] Implement getCurrentTenantId() to extract tenant from NextAuth session
 * [ ] Add middleware to validate tenant access for each request
 * [ ] Create API routes that use getTenantClient() for tenant-specific queries
 * [ ] Implement schema creation logic in createTenant()
 * [ ] Add Prisma migration strategy for schema-per-tenant:
 *     - Run migrations on tenant creation
 *     - Keep admin and tenant schemas synchronized
 * [ ] Implement proper error handling for cross-tenant access
 * [ ] Add logging for tenant context switches
 * [ ] Create tests for multi-tenancy isolation
 */
