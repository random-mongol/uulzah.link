# User Stories - uulzah.link
## Mongolian Scheduling & Polling Application

---

## Table of Contents
1. [User Personas](#user-personas)
2. [User Stories](#user-stories)
3. [User Journeys](#user-journeys)
4. [Feature Priority](#feature-priority)
5. [Acceptance Criteria](#acceptance-criteria)

---

## User Personas

### Persona 1: Bold - The Event Organizer
**Demographics:**
- Age: 32
- Location: Ulaanbaatar, Mongolia
- Occupation: IT Project Manager at a tech company
- Tech Savviness: High

**Background:**
Bold frequently organizes team meetings, company events, and social gatherings with friends. He works with distributed teams across different districts of Ulaanbaatar and needs a quick way to find common availability without endless back-and-forth messaging on WhatsApp or Facebook Messenger.

**Goals:**
- Quickly create polls to find the best time for meetings
- Share polls easily via messaging apps popular in Mongolia (WhatsApp, Facebook Messenger, WeChat)
- See results at a glance without login hassles
- Accommodate both Mongolian and English speakers on his team

**Pain Points:**
- Too many steps to create a simple poll
- Existing tools require account creation, which his non-tech friends resist
- Difficult to share links on mobile messaging apps
- International tools don't consider Mongolian holidays and work culture

**Preferred Devices:** Desktop at work, mobile for personal events

---

### Persona 2: Sarangerel - The Casual User
**Demographics:**
- Age: 26
- Location: Erdenet, Mongolia
- Occupation: Teacher at a local school
- Tech Savviness: Medium

**Background:**
Sarangerel uses her smartphone for most online activities. She organizes monthly gatherings with her university friends and occasional family events. She prefers simple, straightforward applications and gets frustrated with complicated interfaces.

**Goals:**
- Respond to event polls quickly from her phone
- Understand what the poll is about without confusion
- See who else is available before committing
- Share the poll with family members who are less tech-savvy

**Pain Points:**
- Small buttons that are hard to tap on mobile
- Confusing time zones and date formats
- Too many notifications or spam
- Difficult navigation on small screens

**Preferred Devices:** Mobile (Android phone)

---

### Persona 3: Enkhjargal - The Busy Professional
**Demographics:**
- Age: 45
- Location: Darkhan, Mongolia
- Occupation: Doctor at a regional hospital
- Tech Savviness: Low to Medium

**Background:**
Enkhjargal has a hectic schedule and limited time to spend on technology. She participates in medical association meetings and family planning but rarely initiates events herself. She needs tools that work immediately without requiring her to learn new systems.

**Goals:**
- Quickly mark her availability when invited to events
- Receive reminders about events she's committed to
- Understand instructions in Mongolian
- Complete actions with minimal clicks

**Pain Points:**
- Doesn't have time to create accounts
- Forgets passwords for services she rarely uses
- Intimidated by cluttered interfaces
- Needs larger text and clear instructions

**Preferred Devices:** Mobile (iPhone), occasionally desktop

---

### Persona 4: Bataa - The Student Organizer
**Demographics:**
- Age: 20
- Location: Ulaanbaatar, Mongolia
- Occupation: University student
- Tech Savviness: High

**Background:**
Bataa is a student council member who frequently organizes study groups, club activities, and social events with classmates. He's comfortable with technology and social media, using multiple platforms daily. He needs free tools since students have limited budgets.

**Goals:**
- Create fun, engaging polls for casual events
- Get responses quickly from classmates
- Edit events when plans change
- Track who's coming and who's not

**Pain Points:**
- Paid tools are not an option
- Needs to work on university WiFi (sometimes unreliable)
- Classmates often forget to respond
- Difficult to manage multiple ongoing events

**Preferred Devices:** Mobile, laptop

---

## User Stories

### Epic 1: Event Creation

#### US-1.1: Create Basic Event Poll
**As an** event organizer
**I want to** create a scheduling poll with multiple date/time options
**So that** I can find when most participants are available

**Priority:** MVP - Critical

---

#### US-1.2: Add Event Details
**As an** event organizer
**I want to** add event title, description, and location
**So that** participants understand what they're being invited to

**Priority:** MVP - Critical

---

#### US-1.3: Set Deadline for Responses
**As an** event organizer
**I want to** set a deadline by which participants should respond
**So that** I can finalize the event in a timely manner

**Priority:** MVP - High

---

#### US-1.4: Customize Response Options
**As an** event organizer
**I want to** allow participants to mark "Available", "Maybe", or "Not Available"
**So that** I can better gauge actual availability vs. uncertain responses

**Priority:** MVP - High

---

#### US-1.5: Create All-Day Event Options
**As an** event organizer
**I want to** create polls for full-day events without specific times
**So that** I can poll for dates without worrying about exact timing

**Priority:** MVP - Medium

---

#### US-1.6: Duplicate/Copy Event
**As an** event organizer
**I want to** duplicate an existing event poll
**So that** I can quickly create similar recurring events (weekly meetings, monthly gatherings)

**Priority:** Future Enhancement

---

#### US-1.7: Set Response Visibility
**As an** event organizer
**I want to** choose whether participant responses are visible to others
**So that** I can prevent social pressure or groupthink in responses

**Priority:** Future Enhancement

---

### Epic 2: Event Sharing & Access

#### US-2.1: Generate Shareable Link
**As an** event organizer
**I want to** get a unique, shareable link immediately after creating an event
**So that** I can share it via messaging apps, email, or social media

**Priority:** MVP - Critical

---

#### US-2.2: Copy Link with One Click
**As an** event organizer
**I want to** copy the event link with a single tap/click
**So that** I can quickly paste it into messenger apps

**Priority:** MVP - High

---

#### US-2.3: Generate QR Code
**As an** event organizer
**I want to** generate a QR code for my event
**So that** participants can scan and access it easily during in-person meetings

**Priority:** Future Enhancement

---

#### US-2.4: Access Event as Anonymous User
**As a** participant
**I want to** view and respond to events without creating an account
**So that** I can participate quickly without registration barriers

**Priority:** MVP - Critical

---

#### US-2.5: Bookmark Event Link
**As a** participant
**I want to** bookmark or save the event link
**So that** I can return to update my response later

**Priority:** MVP - Medium

---

### Epic 3: Event Participation

#### US-3.1: View Event Details
**As a** participant
**I want to** see the event title, description, location, and all date/time options
**So that** I can understand what I'm being asked to attend

**Priority:** MVP - Critical

---

#### US-3.2: Mark Availability
**As a** participant
**I want to** select which date/time options work for me
**So that** the organizer knows when I'm available

**Priority:** MVP - Critical

---

#### US-3.3: Enter My Name
**As a** participant
**I want to** enter my name when responding
**So that** the organizer knows who is available when

**Priority:** MVP - Critical

---

#### US-3.4: Add Optional Comment
**As a** participant
**I want to** add a comment with my response
**So that** I can provide context (e.g., "I prefer morning slots" or "Can only stay for 1 hour")

**Priority:** MVP - Medium

---

#### US-3.5: See Other Responses
**As a** participant
**I want to** see who else has responded and their availability
**So that** I can coordinate with specific people or see response patterns

**Priority:** MVP - High

---

#### US-3.6: Edit My Response
**As a** participant
**I want to** change my availability after submitting
**So that** I can update if my schedule changes

**Priority:** MVP - High

---

#### US-3.7: Delete My Response
**As a** participant
**I want to** remove my response if I can no longer attend
**So that** the organizer has accurate information

**Priority:** MVP - Medium

---

#### US-3.8: Receive Confirmation
**As a** participant
**I want to** see a confirmation message after submitting my response
**So that** I know my input was recorded successfully

**Priority:** MVP - Medium

---

#### US-3.9: Get Edit Link
**As a** participant
**I want to** receive a unique link to edit my response
**So that** I can update my availability without entering my name again

**Priority:** Future Enhancement

---

### Epic 4: Results & Analytics

#### US-4.1: View Response Summary
**As an** event organizer
**I want to** see which time slots have the most "Available" responses
**So that** I can quickly identify the best time for the event

**Priority:** MVP - Critical

---

#### US-4.2: See Visual Heatmap
**As an** event organizer
**I want to** view a visual representation (colors/heatmap) of availability
**So that** I can identify patterns at a glance

**Priority:** MVP - High

---

#### US-4.3: Track Response Rate
**As an** event organizer
**I want to** see how many people have responded
**So that** I know if I need to send reminders

**Priority:** MVP - Medium

---

#### US-4.4: Export Results
**As an** event organizer
**I want to** export results to Excel or CSV
**So that** I can share with stakeholders or keep records

**Priority:** Future Enhancement

---

#### US-4.5: View Response Timeline
**As an** event organizer
**I want to** see when people responded
**So that** I can track engagement over time

**Priority:** Future Enhancement

---

### Epic 5: Event Management

#### US-5.1: Edit Event Details
**As an** event organizer
**I want to** edit the event title, description, or location after creation
**So that** I can correct mistakes or update information

**Priority:** MVP - High

---

#### US-5.2: Add/Remove Time Slots
**As an** event organizer
**I want to** add or remove date/time options after creation
**So that** I can adjust to changing circumstances

**Priority:** MVP - High

---

#### US-5.3: Access Event with Admin Link
**As an** event organizer
**I want to** receive a special admin link when creating an event
**So that** I can manage the event without creating an account

**Priority:** MVP - Critical

---

#### US-5.4: Close Event to Responses
**As an** event organizer
**I want to** close the poll to new responses
**So that** participants know a decision has been made

**Priority:** MVP - Medium

---

#### US-5.5: Delete Event
**As an** event organizer
**I want to** delete an event poll
**So that** I can remove cancelled or obsolete events

**Priority:** MVP - Medium

---

#### US-5.6: Set Event as Finalized
**As an** event organizer
**I want to** mark which date/time was chosen
**So that** participants can see the final decision

**Priority:** MVP - High

---

#### US-5.7: Archive Old Events
**As an** event organizer
**I want** events to automatically archive after they pass
**So that** I don't clutter my view with old events

**Priority:** Future Enhancement

---

### Epic 6: Notifications & Reminders

#### US-6.1: Notify on New Response
**As an** event organizer
**I want to** receive notifications when someone responds
**So that** I can track participation in real-time

**Priority:** Future Enhancement

---

#### US-6.2: Send Response Reminders
**As an** event organizer
**I want to** send reminders to people who haven't responded
**So that** I can increase response rates

**Priority:** Future Enhancement

---

#### US-6.3: Notify When Event Finalized
**As a** participant
**I want to** receive notification when the organizer finalizes the event
**So that** I can add it to my calendar

**Priority:** Future Enhancement

---

#### US-6.4: Remind Before Event
**As a** participant
**I want to** receive a reminder before the finalized event date
**So that** I don't forget to attend

**Priority:** Future Enhancement

---

### Epic 7: Localization & Accessibility

#### US-7.1: View in Mongolian Language
**As a** Mongolian user
**I want to** use the application in Mongolian (Cyrillic)
**So that** I can navigate comfortably in my native language

**Priority:** MVP - Critical

---

#### US-7.2: Switch Between Languages
**As a** bilingual user
**I want to** toggle between Mongolian and English
**So that** I can use the interface in my preferred language

**Priority:** MVP - High

---

#### US-7.3: Use Mongolian Date/Time Format
**As a** Mongolian user
**I want to** see dates in familiar format (DD/MM/YYYY or Mongolian calendar context)
**So that** I don't get confused by American date formats

**Priority:** MVP - High

---

#### US-7.4: Access on Mobile
**As a** mobile user
**I want** the interface to be fully responsive and touch-friendly
**So that** I can use it easily on my smartphone

**Priority:** MVP - Critical

---

#### US-7.5: Use with Screen Reader
**As a** visually impaired user
**I want** the application to work with screen readers
**So that** I can participate in scheduling polls

**Priority:** Future Enhancement

---

#### US-7.6: Adjust Text Size
**As an** older user
**I want to** increase text size
**So that** I can read content more easily

**Priority:** Future Enhancement

---

### Epic 8: Edge Cases & Special Scenarios

#### US-8.1: Handle Multiple Responses from Same Name
**As an** event organizer
**I want** the system to handle multiple people with the same name
**So that** responses don't get confused or overwritten

**Priority:** MVP - High

---

#### US-8.2: Prevent Spam Responses
**As an** event organizer
**I want** basic protection against spam responses
**So that** my poll isn't flooded with fake data

**Priority:** MVP - Medium

---

#### US-8.3: Work Offline (View Only)
**As a** participant
**I want to** view event details even when offline
**So that** I can check the schedule without internet

**Priority:** Future Enhancement

---

#### US-8.4: Handle Long Events Lists
**As an** event organizer creating polls with many date options
**I want** the interface to remain usable with 20+ time slots
**So that** I can create comprehensive availability polls

**Priority:** MVP - Medium

---

#### US-8.5: Support Different Time Zones
**As an** organizer with international participants
**I want to** specify time zones for events
**So that** participants in different locations see correct times

**Priority:** Future Enhancement

---

#### US-8.6: Recover Lost Admin Link
**As an** event organizer who lost my admin link
**I want** a way to recover or regenerate it
**So that** I don't lose control of my event

**Priority:** Future Enhancement

---

### Epic 9: Social & Collaboration Features

#### US-9.1: Comment on Event
**As a** participant
**I want to** add general comments to the event (not tied to my response)
**So that** I can discuss details with other participants

**Priority:** Future Enhancement

---

#### US-9.2: Suggest New Time Slots
**As a** participant
**I want to** suggest additional time slots
**So that** I can propose alternatives if none of the options work

**Priority:** Future Enhancement

---

#### US-9.3: Vote on Location
**As an** event organizer
**I want to** poll for both time and location
**So that** I can decide both aspects simultaneously

**Priority:** Future Enhancement

---

#### US-9.4: Integrate with Calendar
**As a** participant
**I want to** add the finalized event to Google/Apple Calendar
**So that** I have it in my personal schedule

**Priority:** Future Enhancement

---

---

## User Journeys

### Journey 1: Creating and Sharing a New Event

**Scenario:** Bold wants to organize a team lunch and needs to find a time that works for 8 colleagues.

#### Step-by-Step Flow:

**Step 1: Access the Application**
- Bold opens his browser and navigates to `uulzah.link`
- The homepage displays a clean interface with a prominent "Шинэ санал хураалт үүсгэх" (Create New Poll) button
- No login required - he can start immediately

**Step 2: Enter Event Details**
- Bold clicks the create button
- A form appears with fields:
  - **Event Title:** "Багийн өдрийн хоол" (Team Lunch)
  - **Description:** "Долоо хоног бүр 12:00-13:30 цагийн хооронд" (Weekly from 12:00-13:30)
  - **Location (optional):** "Cafe Amsterdam"
- He fills in the information in Mongolian

**Step 3: Add Date/Time Options**
- Bold sees a date picker interface
- He selects:
  - Monday, November 20, 12:00 PM
  - Tuesday, November 21, 12:00 PM
  - Wednesday, November 22, 12:00 PM
  - Thursday, November 23, 12:00 PM
- Each date is added as a separate option in the poll
- He can easily remove options by clicking an X icon

**Step 4: Configure Settings**
- Bold sets:
  - Response deadline: November 18, 6:00 PM
  - Response visibility: Public (everyone can see others' responses)
  - Response types: Available / Maybe / Not Available
- All settings have sensible defaults already selected

**Step 5: Create Event**
- Bold clicks "Үүсгэх" (Create)
- Within 2 seconds, the poll is created
- He's redirected to two links displayed prominently:
  - **Participant Link:** `uulzah.link/p/abc123` (to share)
  - **Admin Link:** `uulzah.link/a/xyz789` (to manage - saved to his clipboard)
- A message reminds him to save the admin link

**Step 6: Share with Participants**
- Bold sees share buttons for:
  - Copy Link (auto-copies participant link)
  - Facebook Messenger
  - WhatsApp
  - WeChat
  - Email
- He clicks "Copy Link" and pastes it into his team's WhatsApp group
- Message sent: "Та нар аль өдөр чөлөөтэй вэ?" (Which day are you free?) + link

**Step 7: Monitor Responses**
- Bold bookmarks his admin link
- Throughout the day, he checks to see responses coming in
- The interface shows:
  - 5 out of 8 people have responded
  - Tuesday has 4 "Available" responses (highlighted in green)
  - A visual chart makes it easy to see the best option

**Duration:** 3-4 minutes from start to sharing the link

**Success Criteria:**
- Event created without registration
- Link generated and shareable immediately
- Admin link saved for future access
- Interface entirely in Mongolian
- Mobile-friendly for checking responses

---

### Journey 2: Responding to an Event Invitation

**Scenario:** Sarangerel receives a WhatsApp message with a link to a friend's birthday party poll.

#### Step-by-Step Flow:

**Step 1: Receive Invitation**
- Sarangerel's university friend sends a WhatsApp message:
  - "Төрсөн өдрийн баярт оролцох уу? Сонголт хийгээрэй!" (Will you join the birthday party? Make your choice!)
  - Link: `uulzah.link/p/party456`
- She taps the link on her Android phone

**Step 2: View Event Details**
- The page loads quickly (under 2 seconds on 3G)
- She sees:
  - **Event Title:** "Цэцэгийн төрсөн өдөр" (Tsetseg's Birthday)
  - **Description:** "Караоке болон оройн хоол" (Karaoke and dinner)
  - **Location:** "Grand Plaza Hotel"
  - **Date Options:**
    - Friday, November 24, 7:00 PM
    - Saturday, November 25, 7:00 PM
    - Sunday, November 26, 2:00 PM
  - **Response Deadline:** November 20

**Step 3: Review Other Responses**
- Sarangerel scrolls down to see who else is available
- She sees a table showing:
  - **Friday:** 3 Available, 1 Maybe, 0 Not Available
  - **Saturday:** 5 Available, 0 Maybe, 1 Not Available
  - **Sunday:** 2 Available, 2 Maybe, 2 Not Available
- She recognizes friends' names: Болд, Баттулга, Наранцэцэг
- Saturday looks most popular

**Step 4: Enter Name and Mark Availability**
- Sarangerel taps in the "Нэр" (Name) field and types "Сарангэрэл"
- She sees the three date options with three buttons each:
  - ✓ (Available - green)
  - ? (Maybe - yellow)
  - ✗ (Not Available - red)
- She taps:
  - Friday: ? (Maybe - she has work until 6 PM, might be late)
  - Saturday: ✓ (Available - perfect!)
  - Sunday: ✗ (Not Available - family commitment)

**Step 5: Add Optional Comment**
- She taps the "Тайлбар нэмэх" (Add Comment) field
- Types: "Баасан гарагт 7:30 хүртэл очих боломжтой" (Can arrive by 7:30 on Friday)
- This clarifies her "Maybe" response

**Step 6: Submit Response**
- Sarangerel taps the large "Илгээх" (Submit) button
- A success message appears: "Таны хариулт бүртгэгдлээ!" (Your response has been recorded!)
- The page updates to show her response in the table
- She sees her name listed with her availability marked

**Step 7: Save Link for Later**
- Sarangerel notices a message: "Та хариултаа өөрчлөх бол энэ холбоосыг хадгална уу" (Save this link to change your response)
- She copies the URL and saves it in her WhatsApp "Saved Messages"
- This allows her to edit later if needed

**Step 8: Return Later to Check Final Decision**
- Three days later, Sarangerel opens the saved link
- She sees the event is now marked "Confirmed"
- **Final Date:** Saturday, November 25, 7:00 PM
- 8 people are confirmed as attending
- She adds it to her mental calendar

**Duration:** 2-3 minutes for initial response

**Success Criteria:**
- Fast loading on mobile network
- Clear, simple interface in Mongolian
- Easy to see what others chose
- One-tap selection for availability
- Confirmation that response was saved
- Ability to return and edit

---

### Journey 3: Viewing and Analyzing Results

**Scenario:** Bold needs to analyze responses for his team lunch and finalize the date.

#### Step-by-Step Flow:

**Step 1: Access Admin View**
- Two days after creating the event, Bold wants to check results
- He opens his bookmarked admin link: `uulzah.link/a/xyz789`
- The page loads showing the admin dashboard

**Step 2: View Overview Statistics**
- At the top, Bold sees:
  - **Response Rate:** 7/8 (87.5%)
  - **Deadline:** Tomorrow at 6:00 PM
  - **Status:** Open for responses
- He notes that one person (Ганбат) hasn't responded yet

**Step 3: Analyze Visual Heatmap**
- Bold sees a color-coded table:
  - **Monday 12:00 PM:** 2 Available (light green), 3 Maybe, 2 Not Available
  - **Tuesday 12:00 PM:** 5 Available (dark green), 1 Maybe, 1 Not Available
  - **Wednesday 12:00 PM:** 4 Available (medium green), 2 Maybe, 1 Not Available
  - **Thursday 12:00 PM:** 3 Available (light green), 2 Maybe, 2 Not Available
- The darker green on Tuesday makes it immediately obvious

**Step 4: Review Individual Responses**
- Bold scrolls down to see detailed responses
- A table shows each person's name and their availability across all dates
- He can see:
  - Dolgion marked "Not Available" for all dates and commented: "Чөлөө авсан" (On vacation)
  - Saruul marked "Maybe" for Tuesday with comment: "11:30-аас 13:30 хүртэл уулзалттай" (Meeting from 11:30-13:30)
- He appreciates the comments for context

**Step 5: Identify Best Option**
- Based on the data:
  - Tuesday has the most "Available" (5)
  - Tuesday has only 1 "Not Available"
  - If Saruul's meeting ends early, that could be 6/8 people
- Bold decides Tuesday is the best choice

**Step 6: Finalize Event**
- Bold clicks "Огноо сонгох" (Select Date) button next to Tuesday
- A confirmation dialog asks: "Та энэ огноог эцэслэх үү?" (Do you want to finalize this date?)
- He confirms
- The event status changes to "Finalized"
- A badge appears on Tuesday showing it's the chosen date

**Step 7: Notify Participants (Future Feature)**
- Currently, Bold manually messages the WhatsApp group:
  - "Багийн өдрийн хоол: Мягмар 11/21, 12:00 цагт Cafe Amsterdam-д уулзана!" (Team lunch: Tuesday 11/21, 12:00 at Cafe Amsterdam!)
- In future, the system could auto-notify participants

**Step 8: Edit Event Details**
- Bold realizes he made a typo in the restaurant name
- He clicks "Засах" (Edit) on the admin page
- Changes "Cafe Amsterdam" to "Cafe Amsterdam (2-р давхар)" (2nd floor)
- Saves - all participants see the update when they visit the link

**Duration:** 5 minutes to review and finalize

**Success Criteria:**
- Clear visualization of who's available when
- Easy identification of best option
- Ability to finalize and communicate decision
- Editing capabilities for corrections
- No complex analytics - just simple, actionable data

---

### Alternative Journey: Participant Changes Their Mind

**Scenario:** Sarangerel initially said she's available Saturday, but her plans changed.

#### Step-by-Step Flow:

**Step 1: Return to Event**
- Sarangerel opens the link she saved in WhatsApp
- The page loads showing her previous response

**Step 2: Edit Response**
- She sees her current selections highlighted
- Changes Saturday from ✓ (Available) to ✗ (Not Available)
- Updates her comment: "Гэр бүлийн арга хэмжээ" (Family event)

**Step 3: Save Changes**
- Taps "Шинэчлэх" (Update)
- Sees confirmation: "Таны хариулт шинэчлэгдлээ" (Your response has been updated)
- The results table updates immediately

**Duration:** 1 minute

---

## Feature Priority

### MVP (Minimum Viable Product) - Launch Requirements

These features are essential for the first release and provide core functionality comparable to chouseisan.com:

#### Critical (Must Have)
1. **Event Creation**
   - Create poll with multiple date/time options
   - Add event title, description, location
   - Generate unique shareable link
   - Generate admin link for management
   - No account/login required

2. **Event Participation**
   - View event details via link
   - Enter name and mark availability
   - See other participants' responses
   - Edit own response after submitting

3. **Results Display**
   - Visual representation of availability (color-coded table)
   - Show count of available/maybe/not available per time slot
   - Identify best option at a glance

4. **Event Management**
   - Edit event details via admin link
   - Add/remove time slots
   - Finalize chosen date/time
   - Close event to responses

5. **Localization**
   - Full Mongolian (Cyrillic) interface
   - Language toggle (Mongolian/English)
   - Mongolian date/time format
   - Culturally appropriate terminology

6. **Mobile Responsiveness**
   - Touch-friendly interface
   - Optimized for small screens
   - Fast loading on 3G networks
   - Works on iOS and Android browsers

#### High Priority (Should Have)
1. **Enhanced Response Options**
   - Three-state responses (Available/Maybe/Not Available)
   - Optional comments with responses
   - Response deadline setting

2. **Link Management**
   - One-click copy link functionality
   - Clear visual distinction between participant and admin links
   - Easy sharing to popular messaging apps

3. **Results Analysis**
   - Response rate tracking
   - Visual heatmap for quick analysis
   - Sort by availability

4. **Event Options**
   - All-day event options (no specific times)
   - Multiple response type configurations

#### Medium Priority (Nice to Have)
1. **Additional Features**
   - Set response visibility (public/private)
   - Delete event
   - Archive completed events
   - Handle duplicate names gracefully

2. **User Experience**
   - Response confirmation messages
   - Helpful tooltips
   - Error messages in Mongolian
   - Loading states

3. **Basic Security**
   - Spam prevention (rate limiting)
   - Basic validation
   - Link expiration for old events

---

### Phase 2 - Future Enhancements (Post-Launch)

These features can be added after MVP based on user feedback and demand:

#### Near-Term Enhancements (3-6 months)
1. **Notifications**
   - Email notifications for new responses
   - Reminder emails to non-respondents
   - Finalization notifications

2. **Advanced Features**
   - QR code generation for events
   - Duplicate/copy existing events
   - Export results to Excel/CSV
   - Unique edit links for participants

3. **Additional Localization**
   - More language options (English, Russian, Chinese)
   - Timezone support for international participants
   - Mongolian calendar integration

#### Long-Term Enhancements (6-12 months)
1. **Account System (Optional)**
   - Optional user accounts for organizers
   - Event history and management dashboard
   - Saved templates for recurring events
   - Analytics across multiple events

2. **Collaboration Features**
   - Comments and discussions on events
   - Participant suggestions for new time slots
   - Poll for multiple aspects (time + location)
   - Co-organizer support

3. **Integration Features**
   - Calendar integration (Google, Apple, Outlook)
   - Facebook/WhatsApp share previews
   - API for third-party integrations
   - Embedded polls for websites

4. **Accessibility & UX**
   - Screen reader support
   - Text size adjustment
   - High contrast mode
   - Keyboard navigation
   - Offline viewing mode

5. **Advanced Analytics**
   - Response timeline tracking
   - Engagement metrics
   - Popular time slot analysis
   - Export to various formats (PDF, iCal)

---

### Explicitly Out of Scope

These features are NOT planned to maintain simplicity:

1. **Video Conferencing** - Keep focused on scheduling, not hosting
2. **Payment Processing** - No paid features or premium tiers
3. **Complex Permissions** - Keep access model simple (public link vs. admin link)
4. **Social Network Integration** - Avoid login via Facebook, etc.
5. **Advanced Voting** - No ranked-choice or weighted voting systems
6. **File Attachments** - Keep events lightweight
7. **Complex Recurring Events** - No sophisticated recurrence rules
8. **Chat/Messaging** - Use external apps for communication

---

## Acceptance Criteria

### AC-1: Create Basic Event Poll (US-1.1)

**Feature:** User can create a scheduling poll with multiple date/time options

**Acceptance Criteria:**

1. **Given** I am on the homepage
   **When** I click "Create New Poll"
   **Then** I should see an event creation form

2. **Given** I am creating an event
   **When** I enter a title and at least 2 date/time options
   **And** I click "Create"
   **Then** the event should be created successfully
   **And** I should receive both a participant link and an admin link

3. **Given** I am creating an event
   **When** I try to create with only 1 date/time option
   **Then** I should see an error message requesting at least 2 options

4. **Given** I am creating an event
   **When** I try to create without a title
   **Then** I should see an error message requesting a title

5. **Given** I have created an event
   **When** I visit the participant link
   **Then** I should see all the date/time options I specified

**Test Cases:**
- Create event with 2 time slots
- Create event with 20 time slots
- Create event with all-day options
- Create event with mix of dates and times
- Attempt to create with invalid data

---

### AC-2: Mark Availability as Participant (US-3.2)

**Feature:** Participant can select which date/time options work for them

**Acceptance Criteria:**

1. **Given** I visit a valid event link
   **When** I enter my name
   **And** I select "Available" for at least one time slot
   **And** I click "Submit"
   **Then** my response should be recorded
   **And** I should see a success confirmation

2. **Given** I am responding to an event
   **When** I select different availability options for different time slots
   **Then** each time slot should save my specific response (Available/Maybe/Not Available)

3. **Given** I have submitted a response
   **When** I view the results
   **Then** I should see my name and availability reflected in the table

4. **Given** I try to submit without entering a name
   **Then** I should see an error message requesting a name

5. **Given** I try to submit without selecting any availability
   **Then** I should see an error message requesting at least one selection

**Test Cases:**
- Submit with all slots marked "Available"
- Submit with mixed responses across slots
- Submit with all slots marked "Not Available"
- Attempt to submit with empty name
- Submit with very long name (100+ characters)

---

### AC-3: Edit Own Response (US-3.6)

**Feature:** Participant can change availability after initial submission

**Acceptance Criteria:**

1. **Given** I have previously responded to an event
   **When** I visit the event link again
   **And** I enter the same name
   **Then** I should see my previous selections pre-filled

2. **Given** I see my previous selections
   **When** I change my availability for one or more time slots
   **And** I click "Update"
   **Then** my response should be updated
   **And** the results should reflect my new availability

3. **Given** I update my response
   **When** I view the results table
   **Then** I should see only one entry for my name (not duplicated)
   **And** it should show my latest response

4. **Given** multiple people have the same name
   **When** I update my response
   **Then** only my specific response should be updated
   **And** other responses with the same name should remain unchanged

**Test Cases:**
- Edit response after 1 minute
- Edit response after 1 day
- Edit with same name but different availability
- Edit when multiple people share the same name
- Verify old response is replaced, not duplicated

---

### AC-4: View Results with Visual Heatmap (US-4.2)

**Feature:** Organizer can view a visual representation of availability

**Acceptance Criteria:**

1. **Given** I visit the event page (participant or admin view)
   **When** I scroll to the results section
   **Then** I should see a table with time slots as columns and participants as rows

2. **Given** I am viewing results
   **When** a time slot has many "Available" responses
   **Then** it should be highlighted with a stronger green color

3. **Given** I am viewing results
   **When** a time slot has few "Available" responses
   **Then** it should be highlighted with a lighter green or neutral color

4. **Given** I am viewing results
   **When** a time slot has mostly "Not Available" responses
   **Then** it should be highlighted with a red or neutral color

5. **Given** I am viewing the heatmap
   **When** I identify the darkest green slot
   **Then** it should be the time with the most available participants

6. **Given** no one has responded yet
   **When** I view results
   **Then** I should see an empty table with a message "No responses yet"

**Test Cases:**
- View results with 0 responses
- View results with 1 response
- View results with 10+ responses
- View results with all "Available"
- View results with all "Not Available"
- View results with mixed responses
- Verify color gradation matches availability count

---

### AC-5: Access Event with Admin Link (US-5.3)

**Feature:** Event creator receives and can use an admin link for management

**Acceptance Criteria:**

1. **Given** I create a new event
   **When** the event is successfully created
   **Then** I should see both a participant link and an admin link displayed

2. **Given** I see the admin link
   **When** I copy it
   **Then** it should be different from the participant link
   **And** it should contain an identifier suggesting admin access (e.g., `/a/` vs `/p/`)

3. **Given** I visit the admin link
   **When** the page loads
   **Then** I should see additional controls not visible on the participant link
   **Such as** Edit Event, Delete Event, Finalize Date

4. **Given** I visit the participant link
   **When** the page loads
   **Then** I should NOT see admin controls
   **And** I should only see the participant response form

5. **Given** I visit an admin link for an event
   **When** I make changes (edit title, add time slot, etc.)
   **Then** those changes should be saved
   **And** should be visible to all participants immediately

6. **Given** someone tries to guess an admin link
   **When** they visit an invalid admin URL
   **Then** they should see an error message
   **And** should not gain admin access

**Test Cases:**
- Create event and verify admin link works
- Verify admin link shows edit controls
- Verify participant link does not show edit controls
- Edit event via admin link
- Access invalid admin link
- Access admin link after event is deleted

---

### AC-6: Mongolian Language Interface (US-7.1)

**Feature:** Full Mongolian language support for all interface elements

**Acceptance Criteria:**

1. **Given** I visit the application
   **When** my browser language is set to Mongolian
   **Then** the interface should default to Mongolian (Cyrillic)

2. **Given** I am using the application
   **When** I view any page (homepage, create event, event view, results)
   **Then** all text elements should be in Mongolian
   **Including** buttons, labels, placeholders, messages, errors

3. **Given** I create an event
   **When** I see the date picker
   **Then** month names and day names should be in Mongolian
   **And** dates should use DD/MM/YYYY format (or Mongolian preferred format)

4. **Given** I submit a form with errors
   **When** validation fails
   **Then** error messages should be in clear Mongolian
   **And** should be culturally appropriate

5. **Given** I am viewing time slots
   **When** I see times displayed
   **Then** they should use 24-hour format or clearly marked AM/PM in Mongolian

**Test Cases:**
- Browse entire app with Mongolian language
- Verify all buttons translated
- Verify all form labels translated
- Verify all error messages translated
- Verify date/time formats are correct
- Check for any English text leaking through
- Verify Cyrillic characters display correctly on all browsers

---

### AC-7: Mobile Responsive Interface (US-7.4)

**Feature:** Fully responsive, touch-friendly interface for mobile devices

**Acceptance Criteria:**

1. **Given** I visit the application on a mobile device
   **When** the page loads
   **Then** the layout should adapt to my screen size
   **And** all content should be readable without zooming

2. **Given** I am creating an event on mobile
   **When** I tap form fields
   **Then** the appropriate keyboard should appear (text, number, date)
   **And** the page should not zoom in unexpectedly

3. **Given** I am responding to an event on mobile
   **When** I tap availability buttons (Available/Maybe/Not Available)
   **Then** the buttons should be large enough to tap easily (minimum 44x44 px)
   **And** I should get visual feedback on tap

4. **Given** I am viewing results on mobile
   **When** there are many time slots
   **Then** the table should be scrollable horizontally
   **Or** should adapt to a mobile-friendly layout

5. **Given** I am using the app on mobile
   **When** I tap the "Copy Link" button
   **Then** the link should copy to my clipboard
   **And** I should see a confirmation

6. **Given** I am on a slow mobile network (3G)
   **When** I load any page
   **Then** it should load within 3 seconds
   **And** should show a loading indicator

**Test Cases:**
- Test on iPhone Safari (various sizes)
- Test on Android Chrome (various sizes)
- Test on tablet devices
- Test form inputs on mobile
- Test button sizes (minimum 44x44 px)
- Test table scrolling with 10+ time slots
- Test on 3G network speed
- Test link copying on mobile
- Test landscape and portrait orientations

---

### AC-8: Finalize Event Date (US-5.6)

**Feature:** Organizer can mark which date/time was chosen

**Acceptance Criteria:**

1. **Given** I visit my event's admin link
   **When** I view the results
   **Then** I should see a "Finalize" or "Select Date" button next to each time slot

2. **Given** I click "Select Date" for a specific time slot
   **When** I confirm my choice
   **Then** that time slot should be marked as "Confirmed" or "Final"
   **And** a visual indicator (badge, highlight, icon) should appear

3. **Given** I have finalized a date
   **When** participants view the event
   **Then** they should see which date was chosen
   **And** it should be prominently displayed

4. **Given** I have finalized a date
   **When** I visit the admin link again
   **Then** I should be able to "Unfinalize" or change the selection if needed

5. **Given** an event is finalized
   **When** new participants try to respond
   **Then** they should still be able to respond (unless organizer closes responses)
   **But** they should see a message that the date is already decided

**Test Cases:**
- Finalize one time slot
- View finalized event as participant
- View finalized event as organizer
- Change finalized selection to different time slot
- Unfinalize event
- Verify finalized status persists after page refresh

---

### AC-9: One-Click Link Copying (US-2.2)

**Feature:** Easy copying of event link for sharing

**Acceptance Criteria:**

1. **Given** I have created an event
   **When** I see the participant link
   **Then** I should see a "Copy Link" button next to it

2. **Given** I click the "Copy Link" button
   **When** the action completes
   **Then** the link should be copied to my clipboard
   **And** I should see a confirmation message "Link copied!"

3. **Given** the link is copied
   **When** I paste in another application (WhatsApp, email, etc.)
   **Then** the full, correct URL should paste

4. **Given** I am on a mobile device
   **When** I tap "Copy Link"
   **Then** the copy action should work the same as desktop
   **And** I should get haptic feedback (if available)

5. **Given** my browser doesn't support clipboard API
   **When** I click "Copy Link"
   **Then** the link should be selected/highlighted
   **And** I should see instructions to manually copy

**Test Cases:**
- Copy link on desktop Chrome
- Copy link on desktop Firefox
- Copy link on desktop Safari
- Copy link on mobile Safari
- Copy link on mobile Chrome
- Verify copied text is correct full URL
- Test on browser without clipboard API support
- Verify confirmation message appears
- Verify confirmation message disappears after 2-3 seconds

---

### AC-10: Add Optional Comment with Response (US-3.4)

**Feature:** Participants can add a comment when responding

**Acceptance Criteria:**

1. **Given** I am responding to an event
   **When** I view the response form
   **Then** I should see an optional comment field labeled clearly

2. **Given** I enter my availability
   **When** I type a comment (e.g., "I can only stay for 1 hour")
   **And** I submit
   **Then** my comment should be saved along with my response

3. **Given** I have submitted a comment
   **When** anyone views the results
   **Then** they should see my comment displayed next to my name or availability

4. **Given** I am entering a comment
   **When** I type more than 500 characters
   **Then** I should see a character count warning
   **Or** the field should limit input at a reasonable length

5. **Given** I submitted without a comment
   **When** I view results
   **Then** no empty comment should be displayed for my response

6. **Given** I edit my response later
   **When** I update my comment
   **Then** the new comment should replace the old one

**Test Cases:**
- Submit response with comment
- Submit response without comment
- Submit with very long comment (1000+ characters)
- Submit with special characters in comment
- Edit comment after initial submission
- Verify comment displays correctly in results
- Verify comment doesn't break layout on mobile

---

## Cultural Considerations for Mongolian Users

### Language & Terminology
- Use formal, respectful language appropriate for professional contexts
- Use conversational, friendly language for casual events
- Avoid overly technical jargon - keep instructions simple
- Consider that many Mongolian users are bilingual (Mongolian/English) but prefer Mongolian for personal use

### Date & Time Preferences
- Default to 24-hour time format (common in Mongolia)
- Consider Mongolian holidays when suggesting dates:
  - Tsagaan Sar (Lunar New Year) - variable date, usually February
  - Naadam Festival - July 11-13
  - Independence Day - November 26
- Week typically starts on Monday (align calendars accordingly)

### Social Dynamics
- Mongolians often make group decisions collectively - seeing others' responses is important
- Hierarchy matters in professional settings - consider adding role/title fields for business events
- Social events often have flexible timing - "Maybe" option is culturally important

### Technology Usage Patterns
- WhatsApp, Facebook Messenger, and WeChat are dominant messaging platforms
- Mobile-first approach is critical - most users access internet via smartphone
- 3G/4G networks are common but can be slow in rural areas - optimize for speed
- Many users share devices with family members - avoid storing sensitive data locally

### User Behavior Expectations
- Users expect fast, simple interactions with minimal steps
- Registration requirements are a significant barrier
- Users are accustomed to free services
- Privacy is valued - avoid requiring personal information beyond what's necessary

---

## Success Metrics

To measure the success of uulzah.link, track these key metrics:

### User Adoption
- Number of events created per week/month
- Number of participants responding per event (average)
- Repeat usage rate (users creating multiple events)
- Geographic distribution (within Mongolia)

### User Experience
- Time to create an event (target: < 2 minutes)
- Time to respond to event (target: < 1 minute)
- Mobile vs. desktop usage ratio (target: 70%+ mobile)
- Bounce rate on event pages (target: < 30%)
- Response rate per event (target: > 60% of invitees respond)

### Technical Performance
- Page load time on 3G (target: < 3 seconds)
- Page load time on 4G/WiFi (target: < 1 second)
- Uptime (target: 99.9%)
- Error rate (target: < 1%)

### Engagement
- Average number of time slots per event
- Average number of participants per event
- Percentage of events that get finalized
- Time from event creation to first response
- Time from event creation to finalization

### Feature Usage
- Percentage of events using comments
- Percentage of events using deadlines
- Percentage of responses that are edited
- Language preference (Mongolian vs. English)
- Share method preferences (WhatsApp vs. Facebook vs. copy link)

---

## Conclusion

This user stories document outlines a comprehensive vision for **uulzah.link**, a simple yet powerful scheduling and polling application tailored for Mongolian users. By focusing on ease of use, mobile-first design, and cultural appropriateness, the application aims to solve the common problem of coordinating schedules in both professional and personal contexts.

The MVP features prioritize core functionality that delivers immediate value, while future enhancements provide a roadmap for growth based on user feedback and demand. The emphasis on simplicity, no-login requirement, and Mongolian language support addresses the specific needs and preferences of the target audience.

By following these user stories and acceptance criteria, the development team can build a product that truly serves Mongolian users and competes effectively with international alternatives like chouseisan.com while offering localized advantages.

---

**Document Version:** 1.0
**Last Updated:** November 17, 2025
**Status:** Initial Draft
