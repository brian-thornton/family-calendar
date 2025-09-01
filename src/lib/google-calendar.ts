import { google } from 'googleapis'

export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  colorId?: string
}

export interface GoogleCalendar {
  id: string
  summary: string
  description?: string
  backgroundColor?: string
  foregroundColor?: string
  accessRole: string
}

export class GoogleCalendarService {
  private oauth2Client: unknown

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2()
    this.oauth2Client.setCredentials({ access_token: accessToken })
  }

  async getCalendars(): Promise<GoogleCalendar[]> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      const response = await calendar.calendarList.list()
      
      return response.data.items?.map(cal => ({
        id: cal.id!,
        summary: cal.summary!,
        description: cal.description,
        backgroundColor: cal.backgroundColor,
        foregroundColor: cal.foregroundColor,
        accessRole: cal.accessRole!
      })) || []
    } catch (error) {
      console.error('Error fetching calendars:', error)
      throw new Error('Failed to fetch calendars')
    }
  }

  async getEvents(calendarId: string, timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      const response = await calendar.events.list({
        calendarId,
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        singleEvents: true,
        orderBy: 'startTime',
      })

      return response.data.items?.map(event => ({
        id: event.id!,
        summary: event.summary || 'No Title',
        description: event.description,
        start: event.start!,
        end: event.end!,
        colorId: event.colorId
      })) || []
    } catch (error) {
      console.error('Error fetching events:', error)
      throw new Error('Failed to fetch events')
    }
  }

  async getMultipleCalendarsEvents(calendarIds: string[], timeMin?: string, timeMax?: string): Promise<{ calendarId: string; events: GoogleCalendarEvent[] }[]> {
    try {
      const promises = calendarIds.map(async (calendarId) => {
        const events = await this.getEvents(calendarId, timeMin, timeMax)
        return { calendarId, events }
      })

      return await Promise.all(promises)
    } catch (error) {
      console.error('Error fetching multiple calendar events:', error)
      throw new Error('Failed to fetch multiple calendar events')
    }
  }
}

export function getGoogleAuthUrl(): string {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  )

  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly'
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  })
}
