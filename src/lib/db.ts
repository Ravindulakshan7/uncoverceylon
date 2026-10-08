import { prisma } from './prisma';

export { prisma };

export async function logActivity(
  action: string,
  entityType: string,
  entityId: string | number | bigint,
  details: string,
  actor = 'Admin'
) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        entity_type: entityType,
        entity_id: String(entityId || ''),
        details,
        actor,
      },
    });
  } catch (err) {
    console.error('Error logging activity:', err);
  }
}

export async function getActivityLogs(limit = 100) {
  try {
    return await prisma.activityLog.findMany({
      orderBy: { id: 'desc' },
      take: limit,
    });
  } catch (err) {
    console.error('Error getting activity logs:', err);
    return [];
  }
}

export async function clearActivityLogs() {
  try {
    await prisma.activityLog.deleteMany();
    await logActivity('CLEAR_LOGS', 'system', 'logs', 'Admin cleared all activity history');
    return true;
  } catch (err) {
    console.error('Error clearing activity logs:', err);
    return false;
  }
}
