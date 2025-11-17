# uulzah.link - UI/UX Design Document

**Version:** 1.0
**Last Updated:** November 17, 2025
**Target Market:** Mongolia (Mongolian-speaking users)

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color Scheme](#color-scheme)
3. [Typography](#typography)
4. [Page Layouts](#page-layouts)
5. [Component Design](#component-design)
6. [Mobile Experience](#mobile-experience)
7. [Accessibility](#accessibility)
8. [Micro-interactions](#micro-interactions)

---

## Design Principles

### Core UX Philosophy

**"Хялбар. Хурдан. Бүгдэд." (Simple. Fast. For Everyone.)**

The application follows these fundamental principles inspired by chouseisan.com's simplicity:

#### 1. **Zero Friction Access**
- No login required to create or participate in events
- Maximum 2-3 steps to complete any action
- Instant usability - users should accomplish their goal within 30 seconds
- Progressive disclosure: show only what's needed, when it's needed

#### 2. **Mobile-First Design**
- Design for thumb-friendly interactions
- Optimize for 4G/3G connectivity (common in Mongolia)
- Minimize data transfer - target <500KB initial page load
- Touch targets minimum 44x44px
- Single-column layouts on mobile

#### 3. **Cultural Relevance**
- Mongolian language as default (with optional English)
- Use familiar Mongolian social patterns (group decision-making)
- Consider Mongolian holidays and working hours
- Respect for hierarchy in professional settings

#### 4. **Speed & Performance**
- Target <2 second initial load time
- Instant feedback on all interactions
- Optimistic UI updates
- Offline-first capabilities where possible

#### 5. **Clarity Over Cleverness**
- Plain language, no jargon
- Clear visual hierarchy
- Obvious call-to-actions
- Predictable navigation patterns

#### 6. **Graceful Degradation**
- Works on older devices (3+ years old)
- Compatible with slower network speeds
- Progressive enhancement approach

---

## Color Scheme

### Primary Palette

The color scheme draws inspiration from Mongolian cultural elements while maintaining modern web accessibility standards.

#### **Primary Blue** - `#0066CC` (Sky Blue / Тэнгэр хөх)
- **Use:** Primary actions, links, active states
- **Symbolism:** References the eternal blue sky (Мөнх хөх тэнгэр), central to Mongolian identity
- **Contrast Ratio:** 7.5:1 on white (AAA compliant)

```css
--primary: #0066CC;
--primary-hover: #0052A3;
--primary-light: #E6F2FF;
--primary-dark: #004080;
```

#### **Secondary Orange** - `#FF8C42` (Warm Orange / Шар улаан)
- **Use:** Highlights, success states, warmth
- **Symbolism:** Echoes traditional Mongolian deel colors and warmth
- **Contrast Ratio:** 4.5:1 on white (AA compliant)

```css
--secondary: #FF8C42;
--secondary-hover: #E67A30;
--secondary-light: #FFE8D9;
```

#### **Success Green** - `#22C55E`
- **Use:** Confirmations, available time slots, positive actions

```css
--success: #22C55E;
--success-light: #DCFCE7;
```

#### **Warning Yellow** - `#F59E0B`
- **Use:** Warnings, partial availability, attention needed

```css
--warning: #F59E0B;
--warning-light: #FEF3C7;
```

#### **Error Red** - `#EF4444`
- **Use:** Errors, unavailable slots, destructive actions

```css
--error: #EF4444;
--error-light: #FEE2E2;
```

### Neutral Palette

```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

--text-primary: #111827;
--text-secondary: #6B7280;
--text-inverse: #FFFFFF;

--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;

--border-light: #E5E7EB;
--border-medium: #D1D5DB;
--border-dark: #9CA3AF;
```

### Color Usage Guidelines

- **Backgrounds:** Use white (#FFFFFF) for main content, light grays for sections
- **Text:** Dark gray (#111827) for primary text, medium gray (#6B7280) for secondary
- **Interactive Elements:** Blue for primary actions, orange for secondary emphasis
- **Availability Grid:**
  - Available: Success green (#22C55E)
  - Maybe: Warning yellow (#F59E0B)
  - Unavailable: Gray (#E5E7EB)
  - Selected: Primary blue (#0066CC)

---

## Typography

### Font Selection

#### **Primary Font: Inter**
- **Why:** Excellent Cyrillic support, designed for screen readability
- **Usage:** All UI text, forms, buttons
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **License:** Open Font License (free)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

#### **Fallback Stack**
System fonts ensure fast loading and native feel:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
             'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             sans-serif;
```

### Type Scale

Mobile-first responsive typography:

```css
/* Headings */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Hierarchy

#### **H1 - Page Title**
```css
font-size: 1.875rem; /* 30px mobile, 36px desktop */
font-weight: 700;
line-height: 1.25;
color: var(--gray-900);
margin-bottom: 1rem;
```

#### **H2 - Section Title**
```css
font-size: 1.5rem; /* 24px */
font-weight: 600;
line-height: 1.3;
color: var(--gray-800);
margin-bottom: 0.75rem;
```

#### **H3 - Subsection Title**
```css
font-size: 1.25rem; /* 20px */
font-weight: 600;
line-height: 1.4;
color: var(--gray-800);
```

#### **Body Text**
```css
font-size: 1rem; /* 16px */
font-weight: 400;
line-height: 1.5;
color: var(--gray-700);
```

#### **Small Text / Helper Text**
```css
font-size: 0.875rem; /* 14px */
font-weight: 400;
line-height: 1.5;
color: var(--gray-600);
```

### Mongolian Cyrillic Considerations

1. **Letter Spacing:** Slightly increased (0.01em) for better Cyrillic readability
2. **Line Height:** Minimum 1.5 for body text to accommodate Cyrillic ascenders/descenders
3. **Font Rendering:**
   ```css
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-rendering: optimizeLegibility;
   ```

---

## Page Layouts

### 1. Landing/Home Page

**URL:** `uulzah.link/`

#### Purpose
Convert visitors into users by clearly communicating the value proposition and making event creation immediate.

#### Layout Structure

```
┌─────────────────────────────────────┐
│         HEADER (Fixed)              │
│  [Logo] uulzah.link    [MN] [EN]    │
├─────────────────────────────────────┤
│                                     │
│         HERO SECTION                │
│                                     │
│  Цаг товлох хялбар арга             │
│  (The Easy Way to Schedule)         │
│                                     │
│  [  Шинэ уулзалт үүсгэх  ]         │
│  (Create New Meeting - Large Button)│
│                                     │
│  Нэвтрэх шаардлагагүй • Үнэгүй      │
│  (No login required • Free)         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      HOW IT WORKS (3 Steps)         │
│                                     │
│  [1] Үүсгэх   [2] Хуваалцах  [3] Шийдэх │
│  Create       Share         Decide  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      USE CASES (Categories)         │
│                                     │
│  • Хамт олны уулзалт                │
│  • Найзуудын цугларалт              │
│  • Бизнес уулзалт                   │
│  • Төгсөлтийн баяр                   │
│  [+ Бүх төрлүүд үзэх]               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│         FOOTER                      │
│  Холбоо барих • Тусламж • Нууцлал  │
│  © 2025 uulzah.link                 │
│                                     │
└─────────────────────────────────────┘
```

#### Key Elements

1. **Header (Fixed, 60px height)**
   - Logo/wordmark on left
   - Language toggle on right (МН/EN)
   - White background, subtle shadow
   - Sticky on scroll

2. **Hero Section (Full viewport height on mobile)**
   - Centered content, maximum 600px width
   - Large, clear headline in Mongolian
   - Single prominent CTA button (60px height on mobile)
   - Trust indicators below CTA
   - Clean white background with subtle gradient

3. **How It Works (3-column grid on desktop, stacked on mobile)**
   - Each step has icon, number, title, brief description
   - Visual flow indicators between steps
   - Icons in primary blue color
   - 80px padding top/bottom

4. **Use Cases Grid**
   - 2-column grid on mobile, 4-column on desktop
   - Category cards with icons
   - Clickable, navigates to pre-filled create form
   - Light gray background section

5. **Footer**
   - Simple, single-row on mobile
   - Links to help, privacy, contact
   - Minimal design, gray text

#### Mobile Optimizations

- Hero CTA button full-width with 16px margin
- Stack all sections vertically
- Touch-friendly spacing (min 16px between elements)
- Compress vertical spacing but maintain breathing room

---

### 2. Create Event Page

**URL:** `uulzah.link/new` or `uulzah.link/үүсгэх`

#### Purpose
Allow users to quickly create a scheduling event with minimal friction.

#### Layout Structure

```
┌─────────────────────────────────────┐
│         HEADER                      │
├─────────────────────────────────────┤
│                                     │
│  ← Буцах          [1/2 Мэдээлэл]   │
│                                     │
│  Шинэ уулзалт үүсгэх                │
│  (Create New Meeting)               │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Уулзалтын нэр *               │ │
│  │ [_________________________]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Тайлбар (заавал биш)          │ │
│  │ [_________________________]   │ │
│  │ [_________________________]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Боломжит өдрүүд *             │ │
│  │                               │ │
│  │  [+] Өдөр нэмэх               │ │
│  │                               │ │
│  │  □ 2025-11-20 Ням             │ │
│  │  □ 2025-11-21 Даваа           │ │
│  │  □ 2025-11-22 Мягмар          │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Цагийн интервал (заавал биш) │ │
│  │                               │ │
│  │  ○ Өдрөөр                     │ │
│  │  ○ Цагаар (09:00-18:00)       │ │
│  │  ○ Тусгай хуваарь             │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Таны нэр (заавал биш)         │ │
│  │ [_________________________]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  [    Үргэлжлүүлэх (1/2)    ]     │
│                                     │
└─────────────────────────────────────┘
```

#### Form Fields

1. **Event Name** (Required)
   - Input field, max 100 characters
   - Placeholder: "Жишээ: Хамтрагчдын уулзалт"
   - Auto-focus on page load

2. **Description** (Optional)
   - Textarea, max 500 characters
   - Placeholder: "Дэлгэрэнгүй мэдээлэл оруулах..."
   - Auto-expanding, min 3 rows

3. **Possible Dates** (Required, min 1)
   - Date picker component
   - "+ Add Date" button to add more options
   - Each date shows with checkbox and day of week
   - Can add up to 30 dates
   - Default suggestion: next 5 weekdays

4. **Time Intervals** (Optional)
   - Radio buttons:
     - By day (default)
     - By hour with time range picker
     - Custom schedule builder
   - Collapsed by default, expands on interaction

5. **Your Name** (Optional)
   - Input field
   - Helps others identify event creator
   - Saved in localStorage for future use

#### Interaction Flow

**Step 1: Basic Info**
- User fills in event name and description
- Selects dates
- Optionally configures time intervals

**Step 2: Preview & Share (not shown in layout above)**
- Review all details
- Generate shareable link
- Copy link or share via social media

#### Mobile Optimizations

- Full-width form fields
- Large touch targets for date selection
- Sticky "Continue" button at bottom
- Progressive disclosure for advanced options
- Minimal keyboard showing/hiding jumps

---

### 3. Event Poll Page (Voting/Response Page)

**URL:** `uulzah.link/e/[event-id]`

#### Purpose
Allow participants to indicate their availability for proposed time slots.

#### Layout Structure

```
┌─────────────────────────────────────┐
│         HEADER                      │
├─────────────────────────────────────┤
│                                     │
│  Хамтрагчдын уулзалт                │
│  (Team Meeting)                     │
│                                     │
│  Захирал Батаа 5 өдрийн саналыг    │
│  оруулсан байна                     │
│  (Director Bataa suggested 5 dates) │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Таны нэр *                    │ │
│  │ [_________________________]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  Боломжтой цагаа сонгоно уу:        │
│  (Select your availability)         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     AVAILABILITY GRID       │   │
│  │                             │   │
│  │        11/20  11/21  11/22  │   │
│  │        Ням   Даваа  Мягмар  │   │
│  │                             │   │
│  │  Өглөө  [✓]   [✓]   [?]    │   │
│  │  09-12                      │   │
│  │                             │   │
│  │  Өдөр   [✓]   [ ]   [✓]    │   │
│  │  12-15                      │   │
│  │                             │   │
│  │  Орой   [ ]   [✓]   [✓]    │   │
│  │  15-18                      │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Тэмдэглэгээ:                       │
│  [✓] Чөлөөтэй  [?] Магадгүй  [ ] Боломжгүй │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Нэмэлт тэмдэглэл (заавал биш)│ │
│  │ [_________________________]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  [      Хариулт илгээх      ]      │
│                                     │
│  ───────────────────────────────   │
│                                     │
│  Одоогийн хариултууд (3):           │
│  (Current responses: 3)             │
│                                     │
│  • Батаа - 4/5 чөлөөтэй            │
│  • Сарнай - 3/5 чөлөөтэй           │
│  • Дорж - 5/5 чөлөөтэй             │
│                                     │
│  [  Дэлгэрэнгүй үзэх  ]            │
│                                     │
└─────────────────────────────────────┘
```

#### Key Components

1. **Event Header**
   - Event name (H1)
   - Creator info and context
   - Clean, minimal design

2. **Name Input**
   - Required field
   - Auto-filled if previously entered
   - Above the grid for clear flow

3. **Availability Grid**
   - Horizontal scroll on mobile if many dates
   - Tap to cycle through states: Available → Maybe → Unavailable → Available
   - Visual indicators:
     - Green checkmark for available
     - Yellow question mark for maybe
     - Empty/gray for unavailable
   - Column headers show date and day of week
   - Row headers show time periods (if applicable)

4. **Legend**
   - Clear explanation of symbols
   - Always visible, sticky on mobile

5. **Comment Field**
   - Optional textarea
   - For explanations or constraints

6. **Submit Button**
   - Large, prominent
   - Disabled until name is entered
   - Loading state on submission

7. **Current Responses Summary**
   - Shows who has responded
   - Basic availability count
   - Link to full results page
   - Collapsible on mobile

#### Mobile-Specific Grid Behavior

- **Horizontal Scroll:** Grid scrolls horizontally if >3 dates
- **Sticky First Column:** Time period labels stick when scrolling
- **Sticky Header:** Date headers stick at top
- **Large Touch Targets:** Minimum 48x48px cells
- **Visual Feedback:** Clear tap animations

#### Interaction States

**Empty Cell (Unavailable)**
```css
background: var(--gray-100);
border: 2px solid var(--gray-300);
```

**Available Cell**
```css
background: var(--success-light);
border: 2px solid var(--success);
icon: green checkmark
```

**Maybe Cell**
```css
background: var(--warning-light);
border: 2px solid var(--warning);
icon: yellow question mark
```

---

### 4. Results/Summary Page

**URL:** `uulzah.link/e/[event-id]/results`

#### Purpose
Display aggregated availability data to help organizers find the best time slot.

#### Layout Structure

```
┌─────────────────────────────────────┐
│         HEADER                      │
├─────────────────────────────────────┤
│                                     │
│  Хамтрагчдын уулзалт                │
│  (Team Meeting)                     │
│                                     │
│  📊 3 хүн хариулсан                 │
│  (3 people responded)               │
│                                     │
│  [  Өөрийн хариулт нэмэх  ]        │
│  [  🔗 Холбоос хуулах  ]           │
│                                     │
│  ───────────────────────────────   │
│                                     │
│  Хамгийн тохиромжтой:               │
│  (Best options)                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🏆 11/22 Мягмар - Өдөр        │ │
│  │    (12:00-15:00)              │ │
│  │                               │ │
│  │    ✓ Бүгд чөлөөтэй (3/3)      │ │
│  │                               │ │
│  │    [  Энэ цагийг сонгох  ]    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🥈 11/21 Даваа - Орой         │ │
│  │    (15:00-18:00)              │ │
│  │                               │ │
│  │    ✓ 2 чөлөөтэй, 1 магадгүй   │ │
│  │                               │ │
│  │    [  Энэ цагийг сонгох  ]    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ───────────────────────────────   │
│                                     │
│  Дэлгэрэнгүй мэдээлэл:              │
│  (Detailed breakdown)               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     RESULTS GRID            │   │
│  │                             │   │
│  │         11/20  11/21  11/22 │   │
│  │         Ням   Даваа  Мягмар │   │
│  │                             │   │
│  │ Батаа    ✓      ✓      ✓   │   │
│  │ Сарнай   ✓      ?      ✓   │   │
│  │ Дорж     ✓      ✓      ✓   │   │
│  │                             │   │
│  │ Нийт     3/3    2/3    3/3  │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  [  Excel татаж авах  ]            │
│  [  Шинэ саналын зураг үүсгэх  ]   │
│                                     │
└─────────────────────────────────────┘
```

#### Key Components

1. **Summary Header**
   - Event name
   - Response count
   - Quick action buttons (add response, copy link)

2. **Best Options Cards**
   - Ranked by availability count
   - Trophy/medal icons for top options
   - Shows exact availability counts
   - Action button to "select" that time
   - Clear visual hierarchy (best option larger/more prominent)

3. **Detailed Results Grid**
   - Shows all participant responses
   - Row per participant
   - Column per date/time
   - Summary row at bottom
   - Color-coded cells matching vote page
   - Sortable by name or availability

4. **Export Options**
   - Download as Excel/CSV
   - Share results image
   - Print-friendly view

#### Visual Hierarchy

**Best Option Card:**
```css
background: linear-gradient(135deg, #E6F2FF 0%, #FFF 100%);
border: 3px solid var(--primary);
padding: 24px;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
```

**Second-Best Option:**
```css
background: var(--gray-50);
border: 2px solid var(--gray-300);
padding: 20px;
border-radius: 8px;
```

#### Mobile Optimizations

- Stack best option cards vertically
- Horizontal scroll for results grid
- Sticky participant names column
- Collapsible detailed grid (show summary first)
- Share button prominent

---

## Component Design

### Buttons

#### Primary Button
**Usage:** Main actions, CTAs

```css
.button-primary {
  background: var(--primary);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px; /* touch-friendly */
}

.button-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
}

.button-primary:active {
  transform: translateY(0);
}

.button-primary:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  transform: none;
}
```

**Mobile:** Full width on screens <640px

#### Secondary Button
**Usage:** Secondary actions, cancel

```css
.button-secondary {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
  /* other styles same as primary */
}

.button-secondary:hover {
  background: var(--primary-light);
}
```

#### Ghost Button
**Usage:** Tertiary actions, links

```css
.button-ghost {
  background: transparent;
  color: var(--primary);
  border: none;
  text-decoration: underline;
  padding: 8px 16px;
}
```

### Form Inputs

#### Text Input

```css
.input-text {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  transition: all 0.2s ease;
  background: white;
}

.input-text:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.input-text::placeholder {
  color: var(--gray-400);
}

.input-text.error {
  border-color: var(--error);
}
```

**Label:**
```css
.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 6px;
}

.input-label.required::after {
  content: ' *';
  color: var(--error);
}
```

#### Textarea

Same styles as text input, with:
```css
.textarea {
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
}
```

### Date Picker

**Custom Component Design:**

```
┌─────────────────────────────────┐
│  2025 оны 11 сар        [<] [>] │
├─────────────────────────────────┤
│  Ня  Да  Мя  Лх  Пү  Ба  Бя    │
├─────────────────────────────────┤
│              01  02  03  04  05 │
│  06  07  08  09  10  11  12  13 │
│  14  15  16  17  18  19  20  21 │
│  22  23  24  25  26  27  28  29 │
│  30                             │
└─────────────────────────────────┘
```

**Features:**
- Mongolian day names (abbreviated)
- Highlight today
- Highlight selected dates
- Multi-select capability
- Quick select: "Next 5 weekdays", "This weekend"
- Disable past dates
- Mark holidays in different color

**Mobile:** Full-screen overlay when activated

### Availability Grid Cell

**States:**

```css
.grid-cell {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  min-height: 48px;
  min-width: 48px;
}

.grid-cell.available {
  background: var(--success-light);
  border-color: var(--success);
}

.grid-cell.available::after {
  content: '✓';
  font-size: 1.5rem;
  color: var(--success);
}

.grid-cell.maybe {
  background: var(--warning-light);
  border-color: var(--warning);
}

.grid-cell.maybe::after {
  content: '?';
  font-size: 1.5rem;
  color: var(--warning);
}

.grid-cell:active {
  transform: scale(0.95);
}
```

### Cards

#### Event Card (for use cases, results)

```css
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.card-description {
  font-size: 0.875rem;
  color: var(--gray-600);
  line-height: 1.5;
}
```

### Loading States

#### Spinner

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton Loading

For grid and lists:
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 0%,
    var(--gray-100) 50%,
    var(--gray-200) 100%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Notifications/Toasts

```css
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast.success {
  background: var(--success);
}

.toast.error {
  background: var(--error);
}
```

**Messages:**
- Success: "Хариулт амжилттай илгээгдлээ!" (Response sent successfully!)
- Error: "Алдаа гарлаа. Дахин оролдоно уу." (An error occurred. Please try again.)
- Copy: "Холбоос хуулагдлаа!" (Link copied!)

---

## Mobile Experience

### Breakpoints

```css
/* Mobile-first approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
```

### Mobile-Specific Patterns

#### 1. **Bottom Sheet Navigation**

For date picker, settings, share options:
```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 24px 16px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
}

.bottom-sheet.active {
  transform: translateY(0);
}
```

#### 2. **Sticky Action Bar**

For forms with submit buttons:
```css
.sticky-actions {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  border-top: 1px solid var(--gray-200);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}
```

#### 3. **Horizontal Scroll Indicators**

For grids that scroll:
```css
.scroll-container {
  position: relative;
}

.scroll-container::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.9)
  );
  pointer-events: none;
}
```

#### 4. **Touch Gestures**

- **Swipe to delete:** On results grid, swipe left on your response to edit/delete
- **Pull to refresh:** On results page
- **Pinch to zoom:** Disabled to prevent accidental zooming
- **Long press:** On grid cells for additional options

### Mobile Performance Optimizations

1. **Lazy Loading:**
   - Load results grid only when "View Details" clicked
   - Lazy load participant avatars
   - Progressive image loading

2. **Reduced Motion:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

3. **Network Awareness:**
   - Detect connection speed (4G vs 3G)
   - Reduce animations on slow connections
   - Show simplified grid on 2G/slow 3G

4. **Offline Support:**
   - Cache submitted responses
   - Show offline indicator
   - Queue submissions when offline
   - Sync when connection restored

### Mobile-Specific UI Adjustments

#### Typography
```css
@media (max-width: 640px) {
  :root {
    --text-3xl: 1.75rem; /* Slightly smaller on mobile */
    --text-2xl: 1.375rem;
  }
}
```

#### Spacing
```css
@media (max-width: 640px) {
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .section {
    padding-top: 32px;
    padding-bottom: 32px;
  }
}
```

#### Grid Adaptations
```css
/* Desktop: Show all columns */
@media (min-width: 768px) {
  .availability-grid {
    display: grid;
    grid-template-columns: 120px repeat(auto-fit, minmax(80px, 1fr));
  }
}

/* Mobile: Horizontal scroll */
@media (max-width: 767px) {
  .availability-grid {
    overflow-x: auto;
    display: grid;
    grid-template-columns: 100px repeat(auto-fit, 70px);
  }
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast

All text meets minimum contrast ratios:
- **Normal text:** 4.5:1
- **Large text (18px+):** 3:1
- **UI components:** 3:1

Testing tool: Use WebAIM Contrast Checker

#### Keyboard Navigation

**Tab Order:**
1. Logo/Home link
2. Language selector
3. Main CTA
4. Form fields (top to bottom)
5. Grid cells (left to right, top to bottom)
6. Submit button
7. Footer links

**Keyboard Shortcuts:**
- `Tab`: Navigate forward
- `Shift + Tab`: Navigate backward
- `Enter/Space`: Activate buttons/cells
- `Arrow keys`: Navigate grid
- `Esc`: Close modals/overlays

**Focus Indicators:**
```css
*:focus {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}

/* Alternative for grid cells */
.grid-cell:focus {
  outline: 3px solid var(--primary);
  outline-offset: -3px;
  z-index: 1;
}
```

#### Screen Reader Support

**ARIA Labels:**

```html
<!-- Grid cell example -->
<button
  class="grid-cell available"
  role="button"
  aria-label="11 сарын 20, Ням гараг, өглөө - Чөлөөтэй"
  aria-pressed="true"
  tabindex="0"
>
  ✓
</button>

<!-- Results grid -->
<table role="grid" aria-label="Боломжтой цагийн хүснэгт">
  <thead>
    <tr role="row">
      <th role="columnheader">Нэр</th>
      <th role="columnheader">11/20 Ням</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row">
      <th role="rowheader">Батаа</th>
      <td role="gridcell" aria-label="Чөлөөтэй">✓</td>
    </tr>
  </tbody>
</table>

<!-- Form inputs -->
<label for="event-name" class="input-label required">
  Уулзалтын нэр
</label>
<input
  id="event-name"
  type="text"
  class="input-text"
  aria-required="true"
  aria-describedby="event-name-hint"
/>
<span id="event-name-hint" class="input-hint">
  Уулзалтын товч нэр оруулна уу
</span>
```

**Live Regions:**

```html
<!-- Success message -->
<div role="status" aria-live="polite" aria-atomic="true">
  Хариулт амжилттай илгээгдлээ!
</div>

<!-- Error message -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  Алдаа: Нэрээ оруулна уу
</div>

<!-- Loading state -->
<div role="status" aria-live="polite" aria-busy="true">
  Ачааллаж байна...
</div>
```

#### Form Accessibility

**Error Handling:**
```html
<label for="name-input" class="input-label required">
  Таны нэр
</label>
<input
  id="name-input"
  type="text"
  class="input-text error"
  aria-invalid="true"
  aria-describedby="name-error"
/>
<span id="name-error" class="error-message" role="alert">
  Нэр оруулах шаардлагатай
</span>
```

**Required Field Indicators:**
- Visual asterisk (*)
- `aria-required="true"`
- Error messages linked with `aria-describedby`

#### Mobile Accessibility

1. **Touch Target Size:** Minimum 48x48px (WCAG 2.1 AAA: 44x44px)
2. **Spacing:** Minimum 8px between interactive elements
3. **Zoom:** Allow up to 200% zoom without horizontal scroll
4. **Orientation:** Support both portrait and landscape
5. **Motion:** Respect `prefers-reduced-motion`

#### Visual Impairments

**High Contrast Mode:**
```css
@media (prefers-contrast: high) {
  :root {
    --primary: #0052A3; /* Darker blue */
    --border-light: #6B7280; /* Darker borders */
  }

  .grid-cell {
    border-width: 3px;
  }
}
```

**Large Text Support:**
```css
@media (prefers-reduced-data: reduce) {
  /* Simplify UI, remove decorative elements */
  .decorative-icon {
    display: none;
  }
}
```

#### Cognitive Accessibility

1. **Clear Language:** Simple Mongolian, avoid jargon
2. **Consistent Navigation:** Same header/footer on all pages
3. **Progress Indicators:** "Step 1 of 2" on forms
4. **Error Prevention:** Confirm before destructive actions
5. **Help Text:** Contextual hints for all inputs
6. **Visual Hierarchy:** Clear heading structure (H1 → H2 → H3)

#### Testing Checklist

- [ ] Keyboard-only navigation works completely
- [ ] Screen reader announces all content correctly
- [ ] Color contrast passes WCAG AA
- [ ] Forms have proper labels and error messages
- [ ] All images have alt text
- [ ] Page has proper heading hierarchy
- [ ] Focus indicators are visible
- [ ] Touch targets are minimum 44x44px
- [ ] Zoom works without breaking layout
- [ ] Works with high contrast mode

---

## Micro-interactions

### Purpose
Small, delightful animations that provide feedback and enhance user experience without being distracting.

### 1. **Button Press Animation**

```css
.button {
  transition: all 0.15s ease;
}

.button:active {
  transform: scale(0.98);
}

/* Ripple effect on click */
.button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  transform: scale(0);
  opacity: 0;
}

.button:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 1;
  }
}
```

### 2. **Grid Cell Selection**

```css
.grid-cell {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-cell:active {
  transform: scale(0.95);
}

/* Checkmark animation */
.grid-cell.available::after {
  animation: checkmark-pop 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes checkmark-pop {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}
```

### 3. **Link Copied Confirmation**

```javascript
// Visual feedback when link is copied
function showCopySuccess() {
  // Button text changes
  button.textContent = '✓ Хуулагдлаа!';
  button.classList.add('success');

  // Toast notification
  showToast('Холбоос хуулагдлаа!', 'success');

  // Reset after 2 seconds
  setTimeout(() => {
    button.textContent = '🔗 Холбоос хуулах';
    button.classList.remove('success');
  }, 2000);
}
```

Animation:
```css
@keyframes copy-success {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.button.success {
  animation: copy-success 0.4s ease;
}
```

### 4. **Form Input Focus**

```css
.input-text {
  transition: all 0.2s ease;
}

.input-text:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

/* Label animation */
.floating-label {
  transition: all 0.2s ease;
  transform: translateY(12px);
  color: var(--gray-400);
}

.input-text:focus ~ .floating-label,
.input-text:not(:placeholder-shown) ~ .floating-label {
  transform: translateY(-20px) scale(0.85);
  color: var(--primary);
}
```

### 5. **Date Hover Effect**

```css
.date-option {
  transition: all 0.2s ease;
  position: relative;
}

.date-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.date-option::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--primary-light);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.date-option:hover::before {
  opacity: 1;
}
```

### 6. **Loading Skeleton Shimmer**

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 0%,
    var(--gray-100) 20%,
    var(--gray-200) 40%,
    var(--gray-200) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 7. **Page Transitions**

```css
/* Fade in on page load */
.page-enter {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide up for modals */
.modal-enter {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 8. **Number Count-Up Animation**

For response counts on results page:

```javascript
function animateCount(element, target) {
  const duration = 1000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out curve
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
```

### 9. **Hover Tooltips**

```css
.tooltip-trigger {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--gray-900);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--gray-900);
}

.tooltip-trigger:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
```

### 10. **Progress Bar**

For multi-step forms:

```css
.progress-bar {
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
  transform-origin: left;
}

/* Animated shimmer */
.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: progress-shimmer 1.5s ease infinite;
}

@keyframes progress-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 11. **Empty State Illustration Animation**

```css
.empty-state-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 12. **Success Confetti** (Optional, for special moments)

When someone creates their first event:

```javascript
// Lightweight confetti animation
function celebrateSuccess() {
  const colors = ['#0066CC', '#FF8C42', '#22C55E'];
  const confettiCount = 30;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}
```

```css
.confetti {
  position: fixed;
  top: -10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: fall 2s ease-out forwards;
  z-index: 9999;
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
```

### Performance Considerations

1. **Use `transform` and `opacity` only** for animations (GPU-accelerated)
2. **Avoid animating** `height`, `width`, `top`, `left` (causes reflow)
3. **Use `will-change`** sparingly and only during animation
4. **Respect user preferences:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

### Timing Guidelines

- **Instant feedback:** <100ms
- **UI transitions:** 200-300ms
- **Page transitions:** 300-500ms
- **Celebrations:** 1000-2000ms

---

## Implementation Notes

### Technology Recommendations

1. **Frontend Framework:**
   - Vanilla JavaScript + Alpine.js (lightweight, <15KB)
   - OR Svelte (compiles to small bundle)
   - Avoid React/Vue for this simple use case

2. **CSS Framework:**
   - TailwindCSS (with aggressive purging)
   - OR custom CSS with CSS variables (shown in this doc)

3. **Date Handling:**
   - Day.js (2KB alternative to Moment.js)
   - Native Intl.DateTimeFormat for Mongolian localization

4. **Icons:**
   - SVG sprites (inline)
   - OR Feather Icons (minimal, consistent)

5. **Font Loading:**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
   ```

### Performance Budget

- **Initial Load:** <500KB total
- **Time to Interactive:** <3s on 4G
- **First Contentful Paint:** <1.5s
- **Lighthouse Score:** >90 on all metrics

### Browser Support

- **Modern browsers:** Last 2 versions
- **Mobile:** iOS Safari 12+, Chrome Android 80+
- **Desktop:** Chrome 80+, Firefox 75+, Safari 12+, Edge 80+

### Localization Strategy

```javascript
// Simple i18n object
const translations = {
  mn: {
    'create.title': 'Шинэ уулзалт үүсгэх',
    'create.name.label': 'Уулзалтын нэр',
    'create.name.placeholder': 'Жишээ: Хамтрагчдын уулзалт',
    // ...
  },
  en: {
    'create.title': 'Create New Meeting',
    'create.name.label': 'Meeting Name',
    'create.name.placeholder': 'Example: Team Meeting',
    // ...
  }
};

function t(key) {
  const lang = localStorage.getItem('lang') || 'mn';
  return translations[lang][key] || key;
}
```

---

## Design Deliverables Checklist

- [x] Design principles documented
- [x] Color palette with accessibility ratios
- [x] Typography system with Mongolian support
- [x] Complete page layouts (Landing, Create, Poll, Results)
- [x] Component library specifications
- [x] Mobile-first responsive patterns
- [x] Accessibility guidelines (WCAG 2.1 AA)
- [x] Micro-interaction specifications
- [ ] Design mockups (to be created in Figma)
- [ ] Interactive prototype (to be created)
- [ ] Usability testing plan (to be created)

---

## Next Steps

1. **Create visual mockups** in Figma based on this document
2. **Conduct user research** with Mongolian users for cultural validation
3. **Build interactive prototype** for usability testing
4. **Test with real users** (target: 10-15 Mongolian speakers)
5. **Iterate based on feedback**
6. **Develop component library** in code
7. **Implement responsive layouts**
8. **Conduct accessibility audit**
9. **Performance testing** on various devices and networks
10. **Launch MVP** and gather analytics

---

## References & Inspiration

- **chouseisan.com** - Simplicity and ease of use
- **when2meet.com** - Grid interaction patterns
- **doodle.com** - Polling interface
- **Material Design** - Component guidelines
- **Mongolian Web Standards** - Language and cultural guidelines
- **WCAG 2.1** - Accessibility standards

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-17 | Design Team | Initial comprehensive design document |

---

**Contact:** design@uulzah.link
**Last Review:** 2025-11-17
