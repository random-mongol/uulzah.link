import { format, addDays, nextFriday } from 'date-fns'

/**
 * Test data generators for creating consistent test scenarios
 */

export interface TestEventData {
  title: string
  description: string
  dates: Array<{
    date: string
    startTime: string
    endTime: string
  }>
}

export interface TestParticipantData {
  name: string
  comment?: string
  availability: Record<number, 'yes' | 'maybe' | ''>
}

/**
 * Generate a basic event data for testing
 */
export function getBasicEventData(): TestEventData {
  const friday = nextFriday(new Date())
  const saturday = addDays(friday, 1)

  return {
    title: 'Test Meeting',
    description: 'This is a test meeting description',
    dates: [
      {
        date: format(friday, 'yyyy-MM-dd'),
        startTime: '19:00',
        endTime: '21:00',
      },
      {
        date: format(saturday, 'yyyy-MM-dd'),
        startTime: '14:00',
        endTime: '16:00',
      },
    ],
  }
}

/**
 * Generate event data with multiple dates for testing
 */
export function getMultiDateEventData(): TestEventData {
  const today = new Date()
  const dates = []

  for (let i = 1; i <= 5; i++) {
    const date = addDays(today, i)
    dates.push({
      date: format(date, 'yyyy-MM-dd'),
      startTime: '18:00',
      endTime: '20:00',
    })
  }

  return {
    title: 'Team Weekly Sync',
    description: 'Finding the best time for our team meeting',
    dates,
  }
}

/**
 * Generate Mongolian language event data
 */
export function getMongolianEventData(): TestEventData {
  const friday = nextFriday(new Date())

  return {
    title: 'Багийн уулзалт',
    description: 'Багийн долоо хоногийн үндсэн уулзалт',
    dates: [
      {
        date: format(friday, 'yyyy-MM-dd'),
        startTime: '10:00',
        endTime: '11:00',
      },
    ],
  }
}

/**
 * Generate participant data for testing
 */
export function getParticipantData(name: string, availabilityPattern: 'all-yes' | 'all-maybe' | 'mixed' = 'mixed'): TestParticipantData {
  const availability: Record<number, 'yes' | 'maybe' | ''> = {}

  // Generate availability based on pattern
  for (let i = 0; i < 5; i++) {
    if (availabilityPattern === 'all-yes') {
      availability[i] = 'yes'
    } else if (availabilityPattern === 'all-maybe') {
      availability[i] = 'maybe'
    } else {
      availability[i] = i % 2 === 0 ? 'yes' : 'maybe'
    }
  }

  return {
    name,
    comment: `Comment from ${name}`,
    availability,
  }
}

/**
 * Generate invalid event data for validation testing
 */
export function getInvalidEventData() {
  const today = new Date()

  return {
    emptyTitle: {
      title: '',
      description: 'This should fail',
      dates: [
        {
          date: format(today, 'yyyy-MM-dd'),
          startTime: '10:00',
          endTime: '11:00',
        },
      ],
    },
    invalidTime: {
      title: 'Invalid Time Test',
      description: 'This has invalid time increments',
      dates: [
        {
          date: format(today, 'yyyy-MM-dd'),
          startTime: '10:17', // Not a 15-minute increment
          endTime: '11:00',
        },
      ],
    },
    duplicateDates: {
      title: 'Duplicate Dates Test',
      description: 'This has duplicate date/time combinations',
      dates: [
        {
          date: format(today, 'yyyy-MM-dd'),
          startTime: '10:00',
          endTime: '11:00',
        },
        {
          date: format(today, 'yyyy-MM-dd'),
          startTime: '10:00',
          endTime: '11:00',
        },
      ],
    },
  }
}
