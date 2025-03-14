import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SMSHistoryEntry {
  id: string;
  teacherId: string;
  teacherName: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'sent' | 'failed';
  method: string;
}

export function loadSMSHistory(): SMSHistoryEntry[] {
  try {
    const historyPath = path.join(__dirname, '../data/sms_history.json');
    if (!fs.existsSync(historyPath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
  } catch (error) {
    console.error('Error loading SMS history:', error);
    return [];
  }
}

export function saveSMSHistory(history: SMSHistoryEntry[]) {
  const historyPath = path.join(__dirname, '../data/sms_history.json');
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

export function addSMSToHistory(entry: Omit<SMSHistoryEntry, 'id' | 'timestamp' | 'status'>) {
  const history = loadSMSHistory();
  const newEntry: SMSHistoryEntry = {
    ...entry,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  history.unshift(newEntry);
  saveSMSHistory(history);
  return newEntry;
}

export function getSMSHistory() {
  return loadSMSHistory();
}

export async function sendSMS(
  phoneNumber: string,
  message: string,
  method: string = 'native',
  isDevMode: boolean = false
): Promise<boolean> {
  try {
    // In mobile app context, this will be replaced with native SMS functionality
    console.log('Sending SMS:', { phoneNumber, message, method });

    // Add to history
    const historyEntry = addSMSToHistory({
      teacherId: '0',
      teacherName: 'Test',
      message,
      method
    });

    // Update history with success status
    const history = loadSMSHistory();
    const updatedHistory = history.map(entry =>
      entry.id === historyEntry.id
        ? { ...entry, status: 'sent' }
        : entry
    );
    saveSMSHistory(updatedHistory);

    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

export async function sendSubstituteNotification(
  substitute: Teacher,
  assignments: {day: string; period: number; className: string; originalTeacher: string}[]
) {
  const message = assignments.map(assignment => 
    `Dear ${substitute.name}, you have been assigned to cover ${assignment.className} for ${assignment.originalTeacher}. Please confirm your availability.`
  ).join('\n\n');

  const historyEntry = addSMSToHistory({
    teacherId: substitute.id.toString(),
    teacherName: substitute.name,
    message: message,
    method: 'native',
    phone: substitute.phoneNumber || ''
  });

  const smsSent = await sendSMS(substitute.phoneNumber || '', message);

  const history = loadSMSHistory();
  const updatedHistory = history.map(entry => 
    entry.id === historyEntry.id 
      ? { ...entry, status: smsSent ? 'sent' : 'failed' }
      : entry
  );
  saveSMSHistory(updatedHistory);

  return message;
}

export function getSMSHistory(): SMSHistoryEntry[] {
  return loadSMSHistory();
}

import { Teacher } from '@shared/schema';