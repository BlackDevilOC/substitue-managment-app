
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
9. [File Organization](#file-organization)
10. [Development Guide](#development-guide)
11. [Security Considerations](#security-considerations)
12. [Troubleshooting](#troubleshooting)

## Introduction
The Teacher Substitution Management System is a comprehensive solution for educational institutions to manage teacher absences and substitute assignments efficiently. It provides real-time tracking, automated assignments, and instant notifications.

### Core Purpose
- Automate substitute teacher assignments
- Reduce administrative workload
- Ensure minimal disruption to classes
- Track attendance and substitution history
- Enable real-time schedule management
- Provide mobile access for teachers

### Key Benefits
- Reduced manual coordination
- Improved response time
- Better resource utilization
- Enhanced communication
- Data-driven decision making

## System Architecture

### Tech Stack
- Frontend: React 18 with TypeScript
- Backend: Node.js 16+ with Express
- Mobile: React Native with Expo
- Database: File-based JSON storage
- SMS Integration: Multiple provider support
- State Management: TanStack Query
- Styling: Tailwind CSS

### Key Components
1. Web Application (client/)
   - React SPA
   - Real-time updates
   - Responsive design
   - Role-based access

2. Server (server/)
   - Express API
   - File-based storage
   - Authentication system
   - SMS integration

3. Mobile App (mobile/)
   - React Native
   - Offline support
   - Push notifications
   - Quick actions

4. Shared Types (shared/)
   - TypeScript interfaces
   - Validation schemas
   - Utility types

## Features

### 1. Teacher Management
- Teacher profiles with contact info
- Availability tracking
- Schedule management
- Specialization tracking
- History maintenance
- Contact preferences

### 2. Absence Management
- Quick absence recording
- Multiple day handling
- Absence categories
- Documentation upload
- History tracking
- Pattern analysis

### 3. Substitute Assignment
- Intelligent matching algorithm
- Workload balancing
- Conflict prevention
- Preference consideration
- Real-time assignment
- Manual override options

### 4. Notification System
- SMS alerts
- Custom templates
- Delivery tracking
- Bulk messaging
- Read receipts
- History logging

### 5. Schedule Management
- Visual timetable
- Period configuration
- Conflict detection
- Schedule export
- Calendar integration
- Quick adjustments

### 6. Analytics & Reporting
- Absence patterns
- Substitution stats
- Teacher workload
- System usage
- SMS delivery
- Performance metrics

## Setup Instructions

### Prerequisites
```bash
Node.js 16+
npm or yarn
Git
```

### Installation Steps
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - SMS provider setup
   - Server port (default: 5000)
   - Admin account creation
   - File permissions
   - Logging setup

### Data Files Setup
Required CSV files:
- timetable_file.csv: Class schedules
  - Format: Day,Period,Teacher,Class
  - Example: Monday,1,John Doe,10A

- Substitude_file.csv: Substitute details
  - Format: Name,Phone,Availability
  - Example: Jane Smith,+1234567890,M/W/F

### Initial Configuration
1. Admin Setup
   - Create admin account
   - Configure SMS templates
   - Set up period timings
   - Define school schedule

2. System Checks
   - Verify file permissions
   - Test SMS delivery
   - Check file paths
   - Validate schedules

## Detailed Component Guide

### 1. Login Page (/login)
Features:
- Secure authentication
- Role-based access
- Password recovery
- Session management
- Activity logging
- Security measures

### 2. Dashboard (/dashboard)
Components:
- Absent teacher count
- Today's assignments
- Quick actions menu
- Notification center
- System status
- Recent activities

### 3. Teacher Management (/teachers)
Features:
- Profile management
- Schedule viewing
- Contact updates
- Availability setting
- History tracking
- Document upload

### 4. Absence Recording (/absences)
Features:
- Quick recording
- Duration setting
- Document attachment
- History viewing
- Pattern analysis
- Bulk operations

### 5. Substitute Assignment (/substitutes)
Features:
- Auto assignment
- Manual override
- History tracking
- Preference setting
- Conflict checking
- Workload balancing

### 6. Schedule Management (/schedule)
Features:
- Timetable view
- Period management
- Conflict handling
- Export options
- Quick edits
- Calendar sync

### 7. Settings (/settings)
Features:
- SMS configuration
- Period timing
- System preferences
- User management
- Backup options
- Log viewing

## API Documentation

### Authentication
```
POST /api/login
  Body: { username, password }
  Response: { token, user }

GET /api/user
  Headers: { Authorization }
  Response: { user }

POST /api/logout
  Headers: { Authorization }
  Response: { success }
```

### Teacher Management
```
GET /api/teachers
  Response: Teacher[]

POST /api/teachers
  Body: { name, phone, isSubstitute }
  Response: Teacher

GET /api/teacher-schedule/:teacherName
  Response: Schedule[]
```

### Absence Management
```
GET /api/absences
  Response: Absence[]

POST /api/absences
  Body: { teacherId, date }
  Response: Absence

GET /api/get-absent-teachers
  Response: AbsentTeacher[]
```

### Substitute Assignment
```
POST /api/auto-assign-substitutes
  Response: Assignment[]

GET /api/substitute-assignments
  Response: Assignment[]

POST /api/reset-assignments
  Response: { success }
```

### Schedule Management
```
GET /api/schedule/:day
  Response: Schedule[]

POST /api/schedule
  Body: { day, periods }
  Response: Schedule

GET /api/period-config
  Response: PeriodConfig[]
```

## Mobile App

### Setup
```bash
cd mobile
npm install
```

### Key Features
1. Attendance Marking
   - Quick mark
   - Offline support
   - Batch upload
   - History view

2. Schedule Viewing
   - Daily view
   - Weekly view
   - Quick search
   - Offline access

3. Substitute Assignment
   - Accept/reject
   - View details
   - Contact info
   - Directions

4. Push Notifications
   - Assignment alerts
   - Schedule changes
   - System updates
   - Reminders

## Data Structures

### Teacher
```typescript
interface Teacher {
  id: number;
  name: string;
  phoneNumber: string;
  isSubstitute: boolean;
  specializations?: string[];
  availability?: string[];
  preferences?: {
    maxClassesPerDay: number;
    preferredClasses: string[];
  };
}
```

### Schedule
```typescript
interface Schedule {
  id: number;
  day: string;
  period: number;
  teacherId: number;
  className: string;
  subject?: string;
  room?: string;
}
```

### Absence
```typescript
interface Absence {
  id: number;
  teacherId: number;
  date: string;
  substituteId: number | null;
  reason?: string;
  documentation?: string[];
  status: 'pending' | 'approved' | 'completed';
}
```

### SMS Configuration
```typescript
interface SMSConfig {
  provider: string;
  apiKey: string;
  senderId: string;
  templates: {
    assignment: string;
    reminder: string;
    urgent: string;
  };
  retryConfig: {
    attempts: number;
    delay: number;
  };
}
```

## File Storage Structure
```
data/
├── absent_teachers.json     # Current absences
├── assigned_teacher.json    # Substitute assignments
├── class_schedules.json    # Class-wise schedules
├── day_schedules.json      # Day-wise schedules
├── period_config.json      # Period timings
├── teacher_schedules.json  # Teacher timetables
├── total_teacher.json      # All teachers
├── users.json             # User accounts
└── sms_history.json       # Message logs
```

## Development Guide

### Best Practices
1. Code Style
   - Follow TypeScript guidelines
   - Use async/await
   - Implement error handling
   - Add proper logging

2. File Organization
   - Group by feature
   - Separate concerns
   - Use clear naming
   - Maintain hierarchy

3. Error Handling
   - Graceful failures
   - User feedback
   - Error logging
   - Recovery options

4. Performance
   - Optimize queries
   - Cache results
   - Batch operations
   - Lazy loading

## Security Considerations

### Data Protection
- Secure file storage
- Access control
- Data encryption
- Regular backups

### Authentication
- Token-based auth
- Session management
- Password policies
- Role enforcement

### API Security
- Rate limiting
- Input validation
- Error masking
- CORS policy

## Troubleshooting

### Common Issues
1. File Access
   - Check permissions
   - Verify paths
   - Monitor storage
   - Handle locks

2. SMS Delivery
   - Verify credentials
   - Check balance
   - Monitor status
   - Handle failures

3. Assignment Failures
   - Validate data
   - Check conflicts
   - Review logs
   - Manual override

4. Mobile Sync
   - Check connectivity
   - Verify cache
   - Handle conflicts
   - Force refresh

For detailed implementation information, refer to the source code in the respective directories.
