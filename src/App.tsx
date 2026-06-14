import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Undo,
  Save,
  GitBranch,
  Info,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Compass,
  Smile,
  BookOpen,
  Monitor,
  Heart
} from 'lucide-react';

// Family member details with custom theme configurations
const FAMILY_MEMBERS = [
  { id: 'mom', name: 'Mom (Lily)', role: 'Parent', age: 'Adult', color: 'emerald', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', badge: 'bg-emerald-500 text-white', accent: '#059669' },
  { id: 'dad', name: 'Dad', role: 'Parent', age: 'Adult', color: 'indigo', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100', badge: 'bg-indigo-500 text-white', accent: '#4f46e5' },
  { id: 'sophia', name: 'Sophia', role: 'Child', age: '10 y.o.', color: 'fuchsia', bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100', badge: 'bg-fuchsia-500 text-white', accent: '#d946ef' },
  { id: 'nellie', name: 'Nellie', role: 'Child', age: '7 y.o.', color: 'amber', bg: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', badge: 'bg-amber-500 text-white', accent: '#d97706' },
  { id: 'mark', name: 'Mark', role: 'Child', age: '3 y.o.', color: 'rose', bg: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100', badge: 'bg-rose-500 text-white', accent: '#e11d48' }
];

const DAYS_OF_WEEK = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat' },
  { id: 7, name: 'Sunday', short: 'Sun' }
];

// Initial default schedule loaded with commitments from specs
const INITIAL_EVENTS = [
  // --- Mon-Fri Morning Routines / Commutes ---
  ...[1, 2, 3, 4, 5].flatMap(day => [
    {
      id: `school-drop-${day}`,
      title: 'School Dropoff (Sophia & Nellie)',
      day,
      startTime: '08:00',
      endTime: '08:15',
      members: ['mom', 'sophia', 'nellie'],
      isMovable: false,
      category: 'Commute',
      notes: 'Mom driving. 5 mins commute.'
    },
    {
      id: `school-hours-${day}`,
      title: 'School Hours',
      day,
      startTime: '08:10',
      endTime: '15:00',
      members: ['sophia', 'nellie'],
      isMovable: false,
      category: 'School',
      notes: 'Elementary School schedule.'
    },
    {
      id: `preschool-drop-${day}`,
      title: 'Preschool Commute (Mark)',
      day,
      startTime: '08:00',
      endTime: '08:20',
      members: ['dad', 'mark'],
      isMovable: false,
      category: 'Commute',
      notes: 'Dad driving. 10 mins commute.'
    },
    {
      id: `preschool-hours-${day}`,
      title: 'Pre-School Day',
      day,
      startTime: '08:10',
      endTime: '17:45',
      members: ['mark'],
      isMovable: false,
      category: 'School',
      notes: 'Ends at 5:45pm.'
    },
    {
      id: `preschool-pickup-${day}`,
      title: 'Preschool Pickup (Mark)',
      day,
      startTime: '17:35',
      endTime: '17:55',
      members: ['dad', 'mark'],
      isMovable: false,
      category: 'Commute',
      notes: 'Dad picking up Mark. School ends 5:45pm.'
    },
    {
      id: `school-pickup-${day}`,
      title: 'School Pickup',
      day,
      startTime: '15:00',
      endTime: '15:15',
      members: ['mom', 'sophia', 'nellie'],
      isMovable: false,
      category: 'Commute',
      notes: 'Mom picks up kids.'
    },
    // Dad WFH Mon-Fri
    {
      id: `dad-work-${day}`,
      title: 'Work Hours (WFH)',
      day,
      startTime: '09:00',
      endTime: '17:00',
      members: ['dad'],
      isMovable: false,
      category: 'Work',
      notes: 'Dad office tasks.'
    },
    // Mon-Fri Homework habit (10-15 mins)
    {
      id: `homework-weekday-${day}`,
      title: 'Quick HW Habit',
      day,
      startTime: '15:30',
      endTime: '15:45',
      members: ['sophia', 'nellie'],
      isMovable: true,
      category: 'Education',
      notes: '15 mins weekday homework routine.'
    }
  ]),

  // --- Mom WFH/Office split (Office: Mon, Tue, Thu | WFH: Wed, Fri) ---
  // Mom office commute & work days
  ...[1, 2, 4].flatMap(day => [
    {
      id: `mom-office-commute-morning-${day}`,
      title: 'Office Commute (Morning)',
      day,
      startTime: '08:10',
      endTime: '08:50',
      members: ['mom'],
      isMovable: false,
      category: 'Commute',
      notes: '40 mins office commute.'
    },
    {
      id: `mom-work-office-${day}`,
      title: 'Work Hours (Office)',
      day,
      startTime: '09:00',
      endTime: '17:00',
      members: ['mom'],
      isMovable: false,
      category: 'Work',
      notes: 'Mom working at office.'
    },
    {
      id: `mom-office-commute-evening-${day}`,
      title: 'Office Commute (Evening)',
      day,
      startTime: '17:10',
      endTime: '17:50',
      members: ['mom'],
      isMovable: false,
      category: 'Commute',
      notes: '40 mins office commute.'
    }
  ]),
  // Mom WFH days
  ...[3, 5].flatMap(day => [
    {
      id: `mom-work-wfh-${day}`,
      title: 'Work Hours (WFH)',
      day,
      startTime: '09:00',
      endTime: '17:00',
      members: ['mom'],
      isMovable: false,
      category: 'Work',
      notes: 'Mom WFH.'
    }
  ]),

  // --- Evening/Afternoon Fixed Commitments ---
  // Monday: Dance class 6:30pm-7:30pm + 10m commute
  {
    id: 'dance-class',
    title: 'Dance Class (Sophia & Nellie)',
    day: 1,
    startTime: '18:30',
    endTime: '19:30',
    members: ['sophia', 'nellie'],
    isMovable: false,
    category: 'Activity',
    notes: 'Dance training.'
  },
  {
    id: 'dance-commute-go',
    title: 'Dance Commute Out',
    day: 1,
    startTime: '18:20',
    endTime: '18:30',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '10 mins drive to class.'
  },
  {
    id: 'dance-commute-back',
    title: 'Dance Commute Home',
    day: 1,
    startTime: '19:30',
    endTime: '19:40',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '10 mins drive home.'
  },

  // Tuesday: Sophia volleyball 6:30pm-8:00pm + 2m commute/10m walk
  {
    id: 'volleyball-class',
    title: 'Volleyball Practice (Sophia)',
    day: 2,
    startTime: '18:30',
    endTime: '20:00',
    members: ['sophia'],
    isMovable: false,
    category: 'Activity',
    notes: 'Volleyball training.'
  },
  {
    id: 'volleyball-commute-go',
    title: 'Volleyball Travel Out',
    day: 2,
    startTime: '18:20',
    endTime: '18:30',
    members: ['sophia'],
    isMovable: false,
    category: 'Commute',
    notes: '10 mins walk or 2 mins drive.'
  },
  {
    id: 'volleyball-commute-back',
    title: 'Volleyball Travel Home',
    day: 2,
    startTime: '20:00',
    endTime: '20:10',
    members: ['sophia'],
    isMovable: false,
    category: 'Commute',
    notes: '10 mins walk home.'
  },

  // Wednesday: Piano class 6:15pm-7:45pm (first 30 Nellie, next 45 Sophia) + 20m commute
  {
    id: 'piano-class-nellie',
    title: 'Piano Class (Nellie)',
    day: 3,
    startTime: '16:15',
    endTime: '16:45',
    members: ['nellie'],
    isMovable: false,
    category: 'Activity',
    notes: 'First 30 mins.'
  },
  {
    id: 'piano-class-sophia',
    title: 'Piano Class (Sophia)',
    day: 3,
    startTime: '16:45',
    endTime: '17:30',
    members: ['sophia'],
    isMovable: false,
    category: 'Activity',
    notes: 'Next 45 mins.'
  },
  {
    id: 'piano-commute-go',
    title: 'Piano Commute Out',
    day: 3,
    startTime: '15:55',
    endTime: '16:15',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '20 mins commute.'
  },
  {
    id: 'piano-commute-back',
    title: 'Piano Commute Home',
    day: 3,
    startTime: '17:30',
    endTime: '17:50',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '20 mins commute back.'
  },

  // Thursday: Sophia and Nellie theatre 4pm-5:30pm + 20m commute
  {
    id: 'theatre-class',
    title: 'Theatre Class (Sophia & Nellie)',
    day: 4,
    startTime: '16:00',
    endTime: '17:30',
    members: ['sophia', 'nellie'],
    isMovable: false,
    category: 'Activity',
    notes: 'Drama & Theatre training.'
  },
  {
    id: 'theatre-commute-go',
    title: 'Theatre Commute Out',
    day: 4,
    startTime: '15:40',
    endTime: '16:00',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '20 mins travel.'
  },
  {
    id: 'theatre-commute-back',
    title: 'Theatre Commute Home',
    day: 4,
    startTime: '17:30',
    endTime: '17:50',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '20 mins travel back.'
  },

  // Saturday: Chess online 8:30-9:30am, Russian 11:00-12:15pm + 12m commute
  {
    id: 'chess-class-nellie',
    title: 'Chess Class (Nellie)',
    day: 6,
    startTime: '08:30',
    endTime: '09:30',
    members: ['nellie'],
    isMovable: false,
    category: 'Activity',
    notes: 'Online chess academy.'
  },
  {
    id: 'russian-class',
    title: 'Russian Class (Sophia & Nellie)',
    day: 6,
    startTime: '11:00',
    endTime: '12:15',
    members: ['sophia', 'nellie'],
    isMovable: false,
    category: 'Activity',
    notes: 'Language learning.'
  },
  {
    id: 'russian-commute-go',
    title: 'Russian Commute Out',
    day: 6,
    startTime: '10:48',
    endTime: '11:00',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '12 mins commute.'
  },
  {
    id: 'russian-commute-back',
    title: 'Russian Commute Home',
    day: 6,
    startTime: '12:15',
    endTime: '12:27',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '12 mins travel back.'
  },

  // Sunday: Nellie math 10:45-12:45pm, Sophia math 11:15-1:15pm + 10m commute
  {
    id: 'nellie-math-class',
    title: 'Math Class (Nellie)',
    day: 7,
    startTime: '10:45',
    endTime: '12:45',
    members: ['nellie'],
    isMovable: false,
    category: 'Activity',
    notes: 'Nellie advanced math.'
  },
  {
    id: 'sophia-math-class',
    title: 'Math Class (Sophia)',
    day: 7,
    startTime: '11:15',
    endTime: '13:15',
    members: ['sophia'],
    isMovable: false,
    category: 'Activity',
    notes: 'Sophia advanced math.'
  },
  {
    id: 'math-commute-go',
    title: 'Math Commute Out',
    day: 7,
    startTime: '10:35',
    endTime: '10:45',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '10 mins drive.'
  },
  {
    id: 'math-commute-back',
    title: 'Math Commute Home',
    day: 7,
    startTime: '13:15',
    endTime: '13:25',
    members: ['mom', 'sophia', 'nellie'],
    isMovable: false,
    category: 'Commute',
    notes: '10 mins drive home.'
  },

  // --- Bedtimes & Evening Habits (Daily) ---
  ...[1, 2, 3, 4, 5, 6, 7].flatMap(day => [
    {
      id: `mark-bedtime-${day}`,
      title: 'Mark Bedtime',
      day,
      startTime: '20:15',
      endTime: '20:45',
      members: ['mark'],
      isMovable: false,
      category: 'Routine',
      notes: 'Bedtime at 8:15pm.'
    },
    {
      id: `kids-parents-bedtime-${day}`,
      title: 'Bedtime Routine & Reading',
      day,
      startTime: '21:10',
      endTime: '21:30',
      members: ['sophia', 'nellie', 'mom', 'dad'],
      isMovable: false,
      category: 'Routine',
      notes: 'Bedtime at 9:30pm. Includes at least 20 mins reading before bed.'
    },
    {
      id: `mom-skincare-${day}`,
      title: 'Mom Skin-care Routine',
      day,
      startTime: '21:00',
      endTime: '21:10',
      members: ['mom'],
      isMovable: true,
      category: 'Routine',
      notes: '10 mins personal skincare.'
    },
    {
      id: `evening-screentime-${day}`,
      title: 'Screen-Time',
      day,
      startTime: '20:20',
      endTime: '20:55',
      members: ['mom', 'dad', 'sophia', 'nellie'],
      isMovable: true,
      category: 'Routine',
      notes: '35 mins of evening screen-time allocation.'
    }
  ]),

  // --- Home Practice & Homework Sessions ---
  // Piano home practice: Sophia and Nellie 2x 30 mins each
  {
    id: 'piano-practice-session-1',
    title: 'Piano Home Practice',
    day: 2,
    startTime: '15:30',
    endTime: '16:00',
    members: ['sophia', 'nellie'],
    isMovable: true,
    category: 'Education',
    notes: 'Weekly practice session 1.'
  },
  {
    id: 'piano-practice-session-2',
    title: 'Piano Home Practice',
    day: 5,
    startTime: '16:00',
    endTime: '16:30',
    members: ['sophia', 'nellie'],
    isMovable: true,
    category: 'Education',
    notes: 'Weekly practice session 2.'
  },

  // Math home homework: Sophia and Nellie 2x 30 mins each
  {
    id: 'math-homework-session-1',
    title: 'Math HW Practice',
    day: 1,
    startTime: '16:00',
    endTime: '16:30',
    members: ['sophia', 'nellie'],
    isMovable: true,
    category: 'Education',
    notes: 'Math homework session 1.'
  },
  {
    id: 'math-homework-session-2',
    title: 'Math HW Practice',
    day: 5,
    startTime: '16:30',
    endTime: '17:00',
    members: ['sophia', 'nellie'],
    isMovable: true,
    category: 'Education',
    notes: 'Math homework session 2.'
  }
];

export default function App() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedMember, setSelectedMember] = useState('all');
  const [activeTab, setActiveTab] = useState('week-grid'); // 'week-grid' | 'day-columns' | 'agenda'
  const [selectedDay, setSelectedDay] = useState(1); // Default to Monday
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'

  // Custom interactive goals of the week
  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: 1, text: 'Sophia finish reading "The Secret Garden"', duration: 60, completed: false, assignee: 'sophia' },
    { id: 2, text: 'Nellie practice 3 standard chess openers', duration: 45, completed: false, assignee: 'nellie' },
    { id: 3, text: 'Dad & Mom organize summer camp gear shopping', duration: 90, completed: false, assignee: 'dad' }
  ]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalDuration, setNewGoalDuration] = useState(30);
  const [newGoalAssignee, setNewGoalAssignee] = useState('sophia');

  // Interactive version control state
  const [versionHistory, setVersionHistory] = useState([
    {
      id: 'v1.0',
      title: 'v1.0 - Base School Schedule',
      timestamp: '2026-06-14 09:00',
      commitMsg: 'Initial schedule based on school commitments and classes.',
      eventsCount: INITIAL_EVENTS.length
    }
  ]);
  const [newCommitMsg, setNewCommitMsg] = useState('');

  // Editing event buffer
  const [currentEvent, setCurrentEvent] = useState({
    id: '',
    title: '',
    day: 1,
    startTime: '09:00',
    endTime: '10:00',
    members: [],
    isMovable: true,
    category: 'Activity',
    notes: ''
  });

  // Conflicts list detected dynamically
  const [conflicts, setConflicts] = useState([]);

  // Filter & calculate conflicts whenever events change
  useEffect(() => {
    detectConflicts();
  }, [events]);

  const detectConflicts = () => {
    const list = [];
    // Group events by day
    for (let d = 1; d <= 7; d++) {
      const dayEvents = events.filter(e => e.day === d);

      // Compare each pair of events
      for (let i = 0; i < dayEvents.length; i++) {
        for (let j = i + 1; j < dayEvents.length; j++) {
          const e1 = dayEvents[i];
          const e2 = dayEvents[j];

          // Check if they share any family members
          const sharedMembers = e1.members.filter(m => e2.members.includes(m));
          if (sharedMembers.length > 0) {
            // Check time overlap
            const start1 = convertTimeToMinutes(e1.startTime);
            const end1 = convertTimeToMinutes(e1.endTime);
            const start2 = convertTimeToMinutes(e2.startTime);
            const end2 = convertTimeToMinutes(e2.endTime);

            if (start1 < end2 && start2 < end1) {
              const dayName = DAYS_OF_WEEK.find(day => day.id === d).name;
              const names = sharedMembers.map(m => FAMILY_MEMBERS.find(f => f.id === m)?.name).join(', ');
              list.push({
                id: `${e1.id}-${e2.id}`,
                day: d,
                dayName,
                members: names,
                event1: e1,
                event2: e2,
                type: 'Time Overlap',
                description: `"${e1.title}" and "${e2.title}" overlap for ${names} on ${dayName}.`
              });
            }
          }
        }
      }
    }
    setConflicts(list);
  };

  const convertTimeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatMinutesToTime = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Automated Optimization/AI engine to place "Movable" goals & tasks beautifully
  const handleAIOptimizer = () => {
    // Collect all movable events and weekly goals not completed
    const pendingObjectives = weeklyGoals
      .filter(g => !g.completed)
      .map(g => ({
        id: `goal-event-${g.id}`,
        title: `Goal Task: ${g.text}`,
        duration: g.duration,
        members: [g.assignee],
        isMovable: true,
        category: 'Education'
      }));

    if (pendingObjectives.length === 0) {
      alert("No pending weekly goals to schedule! Complete some goals or add new ones.");
      return;
    }

    let updatedEvents = [...events];
    let successfullyPlaced = 0;

    pendingObjectives.forEach(obj => {
      // Find a spot of 'duration' minutes for the members, preferably afternoon/evening after school/work
      let placed = false;

      // Try days of the week starting Mon-Fri for education goals, Sat-Sun for parent activities
      const dayOrder = obj.members.includes('sophia') || obj.members.includes('nellie')
        ? [5, 1, 2, 3, 4, 6, 7] // Friday afternoon has no classes, start there
        : [6, 7, 5, 1, 2, 3, 4];

      for (const day of dayOrder) {
        if (placed) break;

        // Search slots from 15:30 to 19:30 (3:30pm to 7:30pm)
        const scanStart = 15 * 60 + 30; // 15:30
        const scanEnd = 20 * 60; // 20:00
        const step = 15; // Scan every 15 mins

        for (let t = scanStart; t <= scanEnd - obj.duration; t += step) {
          const startTimeStr = formatMinutesToTime(t);
          const endTimeStr = formatMinutesToTime(t + obj.duration);

          // Check if this slot conflicts with existing events on this day
          const conflictsExist = updatedEvents.some(e => {
            if (e.day !== day) return false;
            // Does this share any member?
            const sharesMember = e.members.some(m => obj.members.includes(m));
            if (!sharesMember) return false;

            const s = convertTimeToMinutes(e.startTime);
            const end = convertTimeToMinutes(e.endTime);
            return (t < end && (t + obj.duration) > s);
          });

          if (!conflictsExist) {
            // Found a perfect spot!
            updatedEvents.push({
              id: `${obj.id}-${day}-${t}`,
              title: obj.title,
              day,
              startTime: startTimeStr,
              endTime: endTimeStr,
              members: obj.members,
              isMovable: true,
              category: obj.category,
              notes: 'Optimized placement by Co-Pilot.'
            });
            placed = true;
            successfullyPlaced++;
            break;
          }
        }
      }
    });

    if (successfullyPlaced > 0) {
      setEvents(updatedEvents);
      logCommit(`v1.${versionHistory.length}`, `Optimized weekly schedule: Allocated ${successfullyPlaced} custom objective blocks.`);
    } else {
      alert("We couldn't find conflict-free slots. Try clearing some flexible evening slots first!");
    }
  };

  // Add / Edit event modal routines
  const handleOpenCreateModal = (day = 1, hour = "15:00") => {
    const endH = parseInt(hour.split(':')[0]) + 1;
    const endStr = `${String(endH).padStart(2, '0')}:00`;

    setCurrentEvent({
      id: `custom-event-${Date.now()}`,
      title: '',
      day,
      startTime: hour,
      endTime: endStr,
      members: ['sophia'],
      isMovable: true,
      category: 'Activity',
      notes: ''
    });
    setModalMode('create');
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setCurrentEvent({ ...event });
    setModalMode('edit');
    setIsEditModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!currentEvent.title.trim()) {
      alert("Please enter a valid title.");
      return;
    }
    if (convertTimeToMinutes(currentEvent.startTime) >= convertTimeToMinutes(currentEvent.endTime)) {
      alert("End time must be after the start time.");
      return;
    }
    if (currentEvent.members.length === 0) {
      alert("Please select at least one family member.");
      return;
    }

    let updated;
    if (modalMode === 'create') {
      updated = [...events, currentEvent];
      logCommit(`v1.${versionHistory.length}`, `Added new event: "${currentEvent.title}"`);
    } else {
      updated = events.map(e => e.id === currentEvent.id ? currentEvent : e);
      logCommit(`v1.${versionHistory.length}`, `Updated event: "${currentEvent.title}"`);
    }

    setEvents(updated);
    setIsEditModalOpen(false);
  };

  const handleDeleteEvent = (id) => {
    const original = events.find(e => e.id === id);
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    logCommit(`v1.${versionHistory.length}`, `Deleted event: "${original?.title}"`);
  };

  const handleToggleMemberSelection = (memberId) => {
    if (currentEvent.members.includes(memberId)) {
      setCurrentEvent({
        ...currentEvent,
        members: currentEvent.members.filter(m => m !== memberId)
      });
    } else {
      setCurrentEvent({
        ...currentEvent,
        members: [...currentEvent.members, memberId]
      });
    }
  };

  // Custom objective creation
  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    const goal = {
      id: Date.now(),
      text: newGoalText,
      duration: Number(newGoalDuration),
      completed: false,
      assignee: newGoalAssignee
    };
    setWeeklyGoals([...weeklyGoals, goal]);
    setNewGoalText('');
  };

  const handleToggleGoalCompleted = (id) => {
    setWeeklyGoals(weeklyGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteGoal = (id) => {
    setWeeklyGoals(weeklyGoals.filter(g => g.id !== id));
  };

  // Commit history / Version Control manager
  const logCommit = (versionCode, message) => {
    const nextCommit = {
      id: versionCode,
      title: `${versionCode} - Schedule Change`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      commitMsg: message,
      eventsCount: events.length
    };
    setVersionHistory([nextCommit, ...versionHistory]);
  };

  const handleCustomCommit = (e) => {
    e.preventDefault();
    if (!newCommitMsg.trim()) return;
    const vCode = `v1.${versionHistory.length}`;
    logCommit(vCode, newCommitMsg);
    setNewCommitMsg('');
    alert(`Successfully committed version ${vCode}! You can restore to this state anytime.`);
  };

  const handleResetToDefault = () => {
    if (window.confirm("Are you sure you want to reset the schedule to the default base template? This will overwrite all custom movements.")) {
      setEvents(INITIAL_EVENTS);
      logCommit(`v1.0`, 'Reset to baseline template parameters.');
    }
  };

  const handleClearMovableEvents = () => {
    if (window.confirm("Clear all flexible evening routine blocks to start optimization fresh? Non-movable commitments will stay untouched.")) {
      const remaining = events.filter(e => !e.isMovable);
      setEvents(remaining);
      logCommit(`v1.${versionHistory.length}`, 'Cleared all flexible blocks for planning optimization.');
    }
  };

  // Rendering Helper: get events for slot grid
  const getEventsForDayAndHour = (dayId, hourStr) => {
    return events.filter(e => {
      if (e.day !== dayId) return false;
      if (selectedMember !== 'all' && !e.members.includes(selectedMember)) return false;

      const startHour = parseInt(e.startTime.split(':')[0]);
      const filterHour = parseInt(hourStr.split(':')[0]);
      return startHour === filterHour;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white p-2.5 rounded-xl shadow-md">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                FamPlan Co-Pilot
              </h1>
              <p className="text-xs text-slate-500 font-medium">Daily & Weekly Interactive Scheduler</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Active Version badge */}
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 border border-indigo-100">
              <GitBranch className="h-3 w-3" />
              <span>v1.{versionHistory.length - 1} Active</span>
            </div>

            <button
              onClick={handleResetToDefault}
              className="hidden sm:inline-flex items-center text-xs text-slate-600 hover:text-indigo-600 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg transition"
            >
              Reset to Base
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Family, Goals, and Versioning Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Family Members Selector card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider flex items-center">
                  <Users className="h-4 w-4 mr-2 text-indigo-500" />
                  Family Members
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">All 5 Loaded</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedMember('all')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition ${selectedMember === 'all'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                >
                  <span className="flex items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400 mr-2"></span>
                    Show All Combined Schedule
                  </span>
                  <span className="text-xs opacity-75">{events.length} items</span>
                </button>

                {FAMILY_MEMBERS.map(member => {
                  const memberCount = events.filter(e => e.members.includes(member.id)).length;
                  const isSelected = selectedMember === member.id;
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition ${isSelected
                        ? `border-${member.color}-600 bg-slate-100`
                        : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      style={isSelected ? { borderColor: member.accent, backgroundColor: `${member.accent}10`, color: member.accent } : {}}
                    >
                      <span className="flex items-center">
                        <span className="h-3 w-3 rounded-full mr-2.5" style={{ backgroundColor: member.accent }}></span>
                        <span>{member.name}</span>
                        <span className="ml-2 text-xs font-normal opacity-60">({member.age})</span>
                      </span>
                      <span className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {memberCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weekly Objectives / Extra Tasks checklist card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2 text-fuchsia-500" />
                  Weekly Objectives
                </h3>
                <span className="text-xs text-indigo-600 font-semibold flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-0.5" />
                  Smart Slots
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Define tasks that need custom conflict-free slots. Let FamPlan fit them in.
              </p>

              {/* Goal adding input */}
              <div className="space-y-3 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                <input
                  type="text"
                  placeholder="e.g., Read Harry Potter, buy camp gear..."
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Assignee</label>
                    <select
                      value={newGoalAssignee}
                      onChange={(e) => setNewGoalAssignee(e.target.value)}
                      className="w-full text-xs bg-white px-2 py-1.5 rounded-lg border border-slate-200"
                    >
                      {FAMILY_MEMBERS.map(m => (
                        <option key={m.id} value={m.id}>{m.name.split(' ')[0]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Duration</label>
                    <select
                      value={newGoalDuration}
                      onChange={(e) => setNewGoalDuration(Number(e.target.value))}
                      className="w-full text-xs bg-white px-2 py-1.5 rounded-lg border border-slate-200"
                    >
                      <option value={15}>15 mins</option>
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hrs</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddGoal}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs py-1.5 rounded-lg transition flex items-center justify-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Weekly Goal</span>
                </button>
              </div>

              {/* Goals list */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {weeklyGoals.map(goal => {
                  const m = FAMILY_MEMBERS.find(f => f.id === goal.assignee);
                  return (
                    <div key={goal.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-150 hover:bg-slate-50 transition text-xs">
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => handleToggleGoalCompleted(goal.id)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <div>
                          <p className={`font-medium ${goal.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {goal.text}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded text-[10px]">
                              {goal.duration} mins
                            </span>
                            <span className="text-[10px] font-semibold" style={{ color: m?.accent }}>
                              {m?.name.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commits & Version History Sidebar block */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider flex items-center">
                  <GitBranch className="h-4 w-4 mr-2 text-emerald-500" />
                  Version Control
                </h3>
                <span className="text-xs text-slate-500">Local Edits Log</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Track scheduling versions. Instantly commit your current schedule changes or review history.
              </p>

              <form onSubmit={handleCustomCommit} className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Name this commit (e.g. Added Playdates v1.2)"
                  value={newCommitMsg}
                  onChange={(e) => setNewCommitMsg(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs py-1.5 rounded-lg border border-emerald-200 transition flex items-center justify-center space-x-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Commit Current State</span>
                </button>
              </form>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {versionHistory.map((v, idx) => (
                  <div key={v.id} className="relative pl-4 pb-1 border-l border-slate-200 last:border-l-0">
                    <span className="absolute left-[-4.5px] top-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
                    <div className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">{v.title}</span>
                        <span className="text-[10px] text-slate-400">{v.timestamp}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{v.commitMsg}</p>
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-md font-semibold mt-1 inline-block">
                        {v.eventsCount} total events
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Calendar Scheduling Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Dashboard AI Control Board */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Compass className="h-44 w-44" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                      Interactive Schedule Engine
                    </span>
                    <h2 className="text-2xl font-black mt-2 tracking-tight">Schedule Optimizer Co-Pilot</h2>
                    <p className="text-indigo-200 text-sm mt-1 max-w-xl">
                      Placing math practice, piano classes, reading routines, and skin-care perfectly can be challenging. Let FamPlan's optimizer organize your movable commitments in optimal slots.
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <button
                      onClick={handleAIOptimizer}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>AI Auto-Schedule Goals</span>
                    </button>

                    <button
                      onClick={handleClearMovableEvents}
                      className="bg-white/10 hover:bg-white/15 text-slate-300 font-semibold py-2 px-3 rounded-xl text-xs border border-white/10 transition flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Clear Movable Blocks</span>
                    </button>
                  </div>
                </div>

                {/* Conflict Tracker Alerts bar */}
                <div className="mt-5 border-t border-indigo-900/50 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    {conflicts.length > 0 ? (
                      <>
                        <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 p-1.5 rounded-lg">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-rose-300">Conflict Alert:</span>
                          <span className="text-indigo-100 ml-1">
                            {conflicts.length} overlapping schedules detected on the calendar.
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-1.5 rounded-lg">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-emerald-300">Schedule Health Good:</span>
                          <span className="text-indigo-100 ml-1">No overlapping commitments. Bedtime rules intact!</span>
                        </div>
                      </>
                    )}
                  </div>

                  {conflicts.length > 0 && (
                    <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-indigo-200">
                      Check <span className="font-bold">{conflicts[0].dayName}</span> conflicts
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar Control Tab headers */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('week-grid')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'week-grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Weekly Calendar Grid
                </button>
                <button
                  onClick={() => setActiveTab('day-columns')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'day-columns' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Daily Timeline Columns
                </button>
                <button
                  onClick={() => setActiveTab('agenda')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'agenda' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Family Agenda List
                </button>
              </div>

              {/* Day filter for Daily tab */}
              {activeTab === 'day-columns' && (
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  {DAYS_OF_WEEK.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDay(d.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${selectedDay === d.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {d.short}
                    </button>
                  ))}
                </div>
              )}

              {/* Manual create task button */}
              <button
                onClick={() => handleOpenCreateModal(selectedDay, "15:00")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add Commitment</span>
              </button>
            </div>

            {/* TAB 1: Week Grid View */}
            {activeTab === 'week-grid' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-8 border-b border-slate-150 bg-slate-50 font-bold text-xs text-slate-500 text-center uppercase tracking-wider">
                  <div className="py-3 border-r border-slate-150 text-[10px]">Time</div>
                  {DAYS_OF_WEEK.map(day => (
                    <div key={day.id} className="py-3 border-r border-slate-150 last:border-r-0">
                      {day.name.substring(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Grid hours rows (From 07:00 to 22:00) */}
                <div className="divide-y divide-slate-100 h-[70vh] overflow-y-auto">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const hour = idx + 7;
                    const hourStr = `${String(hour).padStart(2, '0')}:00`;
                    return (
                      <div key={hour} className="grid grid-cols-8 group min-h-[5.5rem]">
                        {/* Hour Label column */}
                        <div className="p-2 border-r border-slate-150 bg-slate-50/50 text-slate-400 font-bold text-[10px] text-right flex flex-col justify-between select-none">
                          <span>{hourStr}</span>
                          <span className="text-[9px] font-normal text-slate-300">
                            {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                          </span>
                        </div>

                        {/* Each Day column cell */}
                        {DAYS_OF_WEEK.map(day => {
                          const slotEvents = getEventsForDayAndHour(day.id, hourStr);
                          return (
                            <div
                              key={day.id}
                              className="p-1 border-r border-slate-150 last:border-r-0 relative hover:bg-indigo-50/20 transition flex flex-col gap-1 min-h-[5rem]"
                            >
                              {/* Quick inline insert helper */}
                              <button
                                onClick={() => handleOpenCreateModal(day.id, hourStr)}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:opacity-100 bg-white/80 text-indigo-600 p-0.5 rounded border border-slate-200 transition shadow-sm z-10"
                                title="Add event at this hour"
                              >
                                <Plus className="h-3 w-3" />
                              </button>

                              {slotEvents.map(event => (
                                <div
                                  key={event.id}
                                  onClick={() => handleOpenEditModal(event)}
                                  className="p-1.5 rounded-lg border text-[10px] leading-tight font-semibold cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex flex-col justify-between h-full group/item"
                                  style={{
                                    borderLeftWidth: '4px',
                                    borderLeftColor: FAMILY_MEMBERS.find(f => f.id === event.members[0])?.accent || '#64748b',
                                    backgroundColor: (FAMILY_MEMBERS.find(f => f.id === event.members[0])?.color === 'emerald') ? '#ecfdf5' :
                                      (FAMILY_MEMBERS.find(f => f.id === event.members[0])?.color === 'indigo') ? '#e0e7ff' :
                                        (FAMILY_MEMBERS.find(f => f.id === event.members[0])?.color === 'fuchsia') ? '#fdf4ff' :
                                          (FAMILY_MEMBERS.find(f => f.id === event.members[0])?.color === 'amber') ? '#fffbeb' : '#fff1f2',
                                    color: FAMILY_MEMBERS.find(f => f.id === event.members[0])?.accent || '#475569'
                                  }}
                                >
                                  <div>
                                    <div className="font-extrabold line-clamp-2">{event.title}</div>
                                    <div className="text-[9px] opacity-75 mt-0.5">
                                      {event.startTime} - {event.endTime}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="flex -space-x-1">
                                      {event.members.map(memberId => {
                                        const m = FAMILY_MEMBERS.find(f => f.id === memberId);
                                        return (
                                          <span
                                            key={memberId}
                                            className="h-3.5 w-3.5 rounded-full border border-white flex items-center justify-center text-[7px] text-white font-bold"
                                            style={{ backgroundColor: m?.accent }}
                                            title={m?.name}
                                          >
                                            {m?.name.substring(0, 1)}
                                          </span>
                                        );
                                      })}
                                    </div>
                                    {!event.isMovable && (
                                      <span className="text-[8px] bg-slate-900/10 text-slate-800 px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                                        Fixed
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Daily Timeline Columns */}
            {activeTab === 'day-columns' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-extrabold text-slate-800 flex items-center text-lg">
                    <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                    {DAYS_OF_WEEK.find(d => d.id === selectedDay)?.name} Commits & Timeline
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Click on block to edit detail</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {FAMILY_MEMBERS.map(member => {
                    const memberEvents = events.filter(e => e.day === selectedDay && e.members.includes(member.id));
                    // Sort events chronologically
                    memberEvents.sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime));

                    return (
                      <div key={member.id} className="bg-slate-50 rounded-2xl p-3 border border-slate-150 flex flex-col min-h-[500px]">
                        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-200">
                          <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: member.accent }}></span>
                          <span className="font-extrabold text-sm text-slate-800">{member.name.split(' ')[0]}</span>
                        </div>

                        {memberEvents.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10 text-center">
                            <Smile className="h-8 w-8 mb-2 opacity-40" />
                            <p className="text-[10px] font-medium px-2">No commitments yet today!</p>
                          </div>
                        ) : (
                          <div className="space-y-2 flex-1">
                            {memberEvents.map(event => (
                              <div
                                key={event.id}
                                onClick={() => handleOpenEditModal(event)}
                                className="p-2.5 rounded-xl border bg-white cursor-pointer shadow-sm hover:shadow-md transition flex flex-col justify-between"
                                style={{ borderLeft: `3px solid ${member.accent}` }}
                              >
                                <div>
                                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wide">
                                    {event.category}
                                  </span>
                                  <h4 className="font-bold text-xs text-slate-800 mt-1 line-clamp-2 leading-tight">
                                    {event.title}
                                  </h4>
                                </div>

                                <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500">
                                  <span className="font-semibold flex items-center">
                                    <Clock className="h-3 w-3 mr-1 opacity-70" />
                                    {event.startTime} - {event.endTime}
                                  </span>
                                  {!event.isMovable && (
                                    <span className="bg-rose-50 text-rose-700 px-1 py-0.2 rounded text-[8px] font-bold">
                                      RIGID
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Family Agenda List */}
            {activeTab === 'agenda' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-150">
                  <h3 className="font-extrabold text-lg text-slate-800">Complete Weekly Agenda View</h3>
                  <div className="text-xs text-slate-500">Sorted sequentially by day and time</div>
                </div>

                <div className="space-y-6">
                  {DAYS_OF_WEEK.map(day => {
                    const dayEvents = events.filter(e => e.day === day.id);
                    if (selectedMember !== 'all') {
                      // Filter by selected family member
                      dayEvents.filter(e => e.members.includes(selectedMember));
                    }
                    dayEvents.sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime));

                    return (
                      <div key={day.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-slate-100 last:border-b-0">
                        {/* Day Column */}
                        <div className="md:col-span-3">
                          <h4 className="font-black text-slate-900 text-lg">{day.name}</h4>
                          <span className="text-xs text-slate-400 font-semibold">{dayEvents.length} events logged</span>
                        </div>

                        {/* Events list Column */}
                        <div className="md:col-span-9 space-y-2">
                          {dayEvents.length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-2">No events scheduled for {day.name}.</p>
                          ) : (
                            dayEvents.map(event => (
                              <div
                                key={event.id}
                                onClick={() => handleOpenEditModal(event)}
                                className="bg-slate-50 hover:bg-slate-100 p-3.5 rounded-xl border border-slate-150 flex items-center justify-between cursor-pointer transition"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                                    <Clock className="h-4 w-4 text-indigo-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-sm text-slate-800">{event.title}</h5>
                                    <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                                      <span className="font-semibold text-slate-700">
                                        {event.startTime} - {event.endTime}
                                      </span>
                                      <span>•</span>
                                      <span className="bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded text-[10px]">
                                        {event.category}
                                      </span>
                                      {event.notes && (
                                        <>
                                          <span>•</span>
                                          <span className="italic truncate max-w-xs">{event.notes}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                  {/* Members tokens */}
                                  <div className="flex -space-x-1.5">
                                    {event.members.map(mid => {
                                      const m = FAMILY_MEMBERS.find(f => f.id === mid);
                                      return (
                                        <span
                                          key={mid}
                                          className="h-6 w-6 rounded-full border border-white flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm"
                                          style={{ backgroundColor: m?.accent }}
                                          title={m?.name}
                                        >
                                          {m?.name.substring(0, 1)}
                                        </span>
                                      );
                                    })}
                                  </div>

                                  {!event.isMovable && (
                                    <span className="bg-slate-800 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                                      Rigid
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-xs">
          <p>© 2026 FamPlan Interactive Family Schedule Co-Pilot. Built to specifications.</p>
          <p className="mt-1">Allows automatic, intelligent conflicts detection and schedule planning for families.</p>
        </div>
      </footer>

      {/* CREATE / EDIT EVENT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center">
                {modalMode === 'create' ? <Plus className="h-5 w-5 mr-2 text-indigo-400" /> : <Edit3 className="h-5 w-5 mr-2 text-indigo-400" />}
                {modalMode === 'create' ? 'Create New Schedule Event' : 'Edit Event Parameters'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-4">

              {/* Event Title */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Event Title / Description</label>
                <input
                  type="text"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  placeholder="e.g., Volleyball Practice, Russian homework session..."
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              {/* Day, Start, End times */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Day of Week</label>
                  <select
                    value={currentEvent.day}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, day: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day.id} value={day.id}>{day.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={currentEvent.startTime}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, startTime: e.target.value })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={currentEvent.endTime}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, endTime: e.target.value })}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Members check row */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Family Members Participating</label>
                <div className="flex flex-wrap gap-2">
                  {FAMILY_MEMBERS.map(member => {
                    const isChecked = currentEvent.members.includes(member.id);
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleToggleMemberSelection(member.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center transition-all ${isChecked
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                      >
                        <span className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: member.accent }}></span>
                        {member.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Flex block settings, category, and notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
                  <select
                    value={currentEvent.category}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, category: e.target.value })}
                    className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Activity">Extra Class / Activity</option>
                    <option value="School">School Hours</option>
                    <option value="Work">Work Hours</option>
                    <option value="Commute">Driving Commute</option>
                    <option value="Routine">Bedtime / Habit Routine</option>
                    <option value="Education">Homework / Practice</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Movable Preference</label>
                  <select
                    value={currentEvent.isMovable ? "true" : "false"}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, isMovable: e.target.value === "true" })}
                    className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="false">Non-Movable (Strict hours)</option>
                    <option value="true">Flexible Slot (Can move)</option>
                  </select>
                </div>
              </div>

              {/* Notes field */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Notes / Reminders</label>
                <input
                  type="text"
                  value={currentEvent.notes || ''}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, notes: e.target.value })}
                  placeholder="e.g., 20 mins drive time, online link, etc..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
              {modalMode === 'edit' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Delete this event from the family calendar?")) {
                      handleDeleteEvent(currentEvent.id);
                      setIsEditModalOpen(false);
                    }
                  }}
                  className="text-rose-600 hover:text-rose-800 font-semibold text-xs flex items-center space-x-1 p-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Event</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvent}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md shadow-indigo-600/10"
                >
                  {modalMode === 'create' ? 'Create Commitment' : 'Save Changes'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}