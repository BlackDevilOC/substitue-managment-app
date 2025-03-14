
# Teacher Substitution Management System Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Features](#features)
4. [Setup Instructions](#setup-instructions)
5. [Detailed Component Guide](#detailed-component-guide)
6. [API Documentation](#api-documentation)
7. [Mobile App](#mobile-app)
8. [Data Structures](#data-structures)

## Introduction
The Teacher Substitution Management System is a comprehensive solution for educational institutions to manage teacher absences and substitute assignments. It includes both web and mobile interfaces, automated substitute assignment algorithms, and SMS notification capabilities.

### Core Purpose
- Automate the process of managing teacher absences
- Efficiently assign substitute teachers
- Notify relevant parties through SMS
- Track attendance and substitution history
- Provide real-time schedule management

## System Architecture

### Tech Stack
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Mobile: React Native with Expo
- Database: File-based JSON storage
- SMS Integration: Multiple provider support

### Key Components
1. Web Application (client/)
2. Server (server/)
3. Mobile App (mobile/)
4. Shared Types (shared/)

## Features

### 1. Teacher Management
- Track all teachers and their schedules
- Maintain teacher contact information
- Record teacher specializations and availability
- Handle both regular and substitute teachers

### 2. Absence Management
- Record teacher absences
- Track absence history
- Generate absence reports
- Manage long-term and short-term absences

### 3. Substitute Assignment
- Automated substitute matching algorithm
- Consider teacher schedules and availability
- Prevent scheduling conflicts
- Balance workload among substitutes

### 4. Notification System
- SMS notifications for substitutes
- Configurable message templates
- Delivery status tracking
- History of sent messages

### 5. Schedule Management
- Daily period configuration
- Class schedule tracking
- Timetable management
- Conflict detection

## Setup Instructions

### Prerequisites
```bash
Node.js 16+
npm or yarn
```

### Installation Steps
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure environment:
   - Set up SMS provider credentials
   - Configure server port (default: 5000)
   - Set up initial admin account

### Data Files Setup
Required CSV files:
- timetable_file.csv: Contains regular class schedules
- Substitude_file.csv: Contains substitute teacher information

## Detailed Component Guide

### 1. Login Page
- Path: `/login`
- Features:
  - User authentication
  - Role-based access control
  - Session management

### 2. Dashboard
- Path: `/dashboard`
- Components:
  - Absent teachers count
  - Today's substitutions
  - Quick actions
  - Notification center

### 3. Teacher Management
- Path: `/teachers`
- Features:
  - Add/Edit teachers
  - View teacher schedules
  - Contact information management
  - Availability tracking

### 4. Absence Recording
- Path: `/absences`
- Features:
  - Mark teachers absent
  - Record absence duration
  - Attach supporting documents
  - View absence history

### 5. Substitute Assignment
- Path: `/substitutes`
- Features:
  - Manual assignment
  - Automated assignment
  - View substitute history
  - Manage preferences

### 6. Schedule Management
- Path: `/schedule`
- Features:
  - View daily schedules
  - Manage periods
  - Handle conflicts
  - Export timetables

### 7. Settings
- Path: `/settings`
- Features:
  - SMS configuration
  - Period timings
  - System preferences
  - User management

## API Documentation

### Authentication Endpoints
```
POST /api/login
GET /api/user
POST /api/logout
```

### Teacher Management
```
GET /api/teachers
POST /api/teachers
GET /api/teacher-schedule/:teacherName
```

### Absence Management
```
GET /api/absences
POST /api/absences
GET /api/get-absent-teachers
```

### Substitute Assignment
```
POST /api/auto-assign-substitutes
GET /api/substitute-assignments
POST /api/reset-assignments
```

### Schedule Management
```
GET /api/schedule/:day
POST /api/schedule
GET /api/period-config
```

## Mobile App

### Setup
```bash
cd mobile
npm install
```

### Features
1. Attendance Marking
2. Schedule Viewing
3. Substitute Assignment
4. Push Notifications

### Build Instructions
Detailed in `mobile/BUILD_APK.md`

## Data Structures

### Teacher Object
```typescript
interface Teacher {
  id: number;
  name: string;
  phoneNumber: string;
  isSubstitute: boolean;
}
```

### Schedule Object
```typescript
interface Schedule {
  day: string;
  period: number;
  teacherId: number;
  className: string;
}
```

### Absence Object
```typescript
interface Absence {
  id: number;
  teacherId: number;
  date: string;
  substituteId: number | null;
}
```

### SMS Configuration
```typescript
interface SMSConfig {
  provider: string;
  apiKey: string;
  senderId: string;
}
```

## File Storage Structure
```
data/
├── absent_teachers.json
├── assigned_teacher.json
├── class_schedules.json
├── day_schedules.json
├── period_config.json
├── teacher_schedules.json
├── total_teacher.json
└── users.json
```

For detailed implementation information, refer to the source code in the respective directories.
