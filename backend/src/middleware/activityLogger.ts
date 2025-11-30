/**
 * Activity Logger Middleware
 * Logs all admin actions for audit trail
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface ActivityLog {
  timestamp: string;
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  statusCode?: number;
  error?: string;
}

/**
 * Log admin activities for audit trail
 */
export const activityLogger = (req: Request, res: Response, next: NextFunction) => {
  // Only log for authenticated admin users
  if (!req.user || req.user.role !== 'admin') {
    return next();
  }

  // Capture original res.json to log after response
  const originalJson = res.json.bind(res);
  
  res.json = (body: any) => {
    const user = req.user as any; // Type assertion for custom user properties
    
    const activityLog: ActivityLog = {
      timestamp: new Date().toISOString(),
      userId: user._id?.toString() || 'unknown',
      userEmail: user.email || 'unknown',
      userRole: user.role || 'unknown',
      action: getActionType(req.method, req.path),
      resource: getResourceType(req.path),
      resourceId: getResourceId(req.path),
      method: req.method,
      path: req.path,
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.get('user-agent') || 'unknown',
      statusCode: res.statusCode,
    };

    // Log based on status code
    if (res.statusCode >= 400) {
      activityLog.error = body.message || 'Unknown error';
      logger.warn('Admin action failed', activityLog);
    } else if (isWriteOperation(req.method)) {
      logger.info('Admin action successful', activityLog);
    }

    return originalJson(body);
  };

  next();
};

/**
 * Determine action type from method and path
 */
function getActionType(method: string, path: string): string {
  const actions: Record<string, string> = {
    POST: 'CREATE',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE',
    GET: 'READ',
  };

  const action = actions[method] || 'UNKNOWN';
  
  // Special cases
  if (path.includes('/status')) return 'UPDATE_STATUS';
  if (path.includes('/upload')) return 'UPLOAD';
  
  return action;
}

/**
 * Extract resource type from path
 */
function getResourceType(path: string): string {
  if (path.includes('/products')) return 'PRODUCT';
  if (path.includes('/categories')) return 'CATEGORY';
  if (path.includes('/orders')) return 'ORDER';
  if (path.includes('/users')) return 'USER';
  if (path.includes('/upload')) return 'FILE';
  
  return 'UNKNOWN';
}

/**
 * Extract resource ID from path
 */
function getResourceId(path: string): string | undefined {
  // Match MongoDB ObjectId pattern in path
  const match = path.match(/\/([a-f0-9]{24})/i);
  return match ? match[1] : undefined;
}

/**
 * Check if operation modifies data
 */
function isWriteOperation(method: string): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
}

/**
 * Get activity logs (for admin dashboard)
 */
export const getActivityLogs = async () => {
  // This would query a logs database in a real implementation
  // For now, it reads from the logs file
  return {
    message: 'Activity logs are stored in logs/combined.log',
    note: 'Implement log database for querying',
  };
};
