import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeForFirestore(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Dates
  if (obj instanceof Date) {
    return obj;
  }

  // Skip Firestore internal types (FieldValues, Timestamps)
  // These usually have an isEqual method and are not plain objects
  if (typeof obj.isEqual === 'function' || (obj.constructor && obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array')) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }

  // Only process plain objects
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return obj;
  }

  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== undefined) {
        sanitized[key] = sanitizeForFirestore(value);
      }
    }
  }
  return sanitized;
}
