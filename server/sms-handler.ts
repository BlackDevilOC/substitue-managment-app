import { Teacher } from '@shared/schema';
import { storage } from './storage';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SMS_HISTORY_FILE = path.join(__dirname, '../data/sms_history.json');

interface SMSHistoryEntry {
  id: string;
  teacherId: string;
  teacherName: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
  method: 'mobile';
  phone: string;
}

// Initialize SMS history file if it doesn't exist
export function initializeSMSHistory() {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(SMS_HISTORY_FILE, JSON.stringify([], null, 2));
  } catch (error) {
    console.error('Error initializing SMS history file:', error);
  }
}

// Load SMS history
export function loadSMSHistory(): SMSHistoryEntry[] {
  try {
    if (!fs.existsSync(SMS_HISTORY_FILE)) {
      initializeSMSHistory();
    }
    const data = fs.readFileSync(SMS_HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading SMS history:', error);
    return [];
  }
}

// Save SMS history
export function saveSMSHistory(history: SMSHistoryEntry[]) {
  try {
    fs.writeFileSync(SMS_HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving SMS history:', error);
  }
}

// Add new SMS entry to history
export function addSMSToHistory(entry: Omit<SMSHistoryEntry, 'id' | 'sentAt'>) {
  const history = loadSMSHistory();
  const newEntry: SMSHistoryEntry = {
    ...entry,
    id: Math.random().toString(36).substr(2, 9),
    sentAt: new Date().toISOString()
  };
  history.push(newEntry);
  saveSMSHistory(history);
  return newEntry;
}

export async function sendSMS(
  phoneNumber: string, 
  message: string,
  method: 'mobile' = 'mobile',
  isDevMode: boolean = false
): Promise<boolean> {
  try {
    // Send message to mobile app for native SMS sending
    if (global.WebSocket) {
      global.WebSocket.send(JSON.stringify({
        type: 'SEND_SMS',
        payload: { phoneNumber, message }
      }));
    }
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
    status: 'pending',
    method: 'mobile',
    phone: substitute.phoneNumber || ''
  });

  const smsSent = await sendSMS(substitute.phoneNumber || '', message);

  const history = loadSMSHistory();
  const updatedHistory = history.map(entry => 
    entry.id === historyEntry.id 
      ? { ...entry, status: smsSent ? 'sent' as const : 'failed' as const }
      : entry
  );
  saveSMSHistory(updatedHistory);

  return message;
}

export function getSMSHistory(): SMSHistoryEntry[] {
  return loadSMSHistory();
}