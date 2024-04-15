import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Calendar,
  CalendarDocument,
  Event,
  EventDocument,
} from 'schemas/calendar.schema';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Calendar.name) private calendarModel: Model<CalendarDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(
    user: any,
    eventData: { title: string; start: Date; end: Date },
  ): Promise<Calendar> {
    try {
      const event = await this.eventModel.create(eventData);
      let calendar = await this.calendarModel
        .findOne({ user: user._id })
        .exec();
      if (!calendar) {
        calendar = new this.calendarModel({ user: user._id, events: [] });
      }
      calendar.events.push(event._id);
      await calendar.save();
      return calendar.populate('events');
    } catch (error) {
      throw new Error('Failed to create event');
    }
  }

  async updateEvent(
    user: any,
    eventId: string,
    eventData: { title?: string; start?: Date; end?: Date; descrip?: string },
  ): Promise<Calendar> {
    try {
      const calendar = await this.calendarModel
        .findOne({ user: user._id })
        .populate('events')
        .exec();
      if (!calendar) {
        throw new Error('Calendar not found');
      }
      const existingEventIndex = calendar.events.findIndex((e) => {
        return e._id.toString() === eventId;
      });
      if (existingEventIndex === -1) {
        throw new Error('Event not found');
      }
      const existingEvent = await this.eventModel.findById(eventId).exec();
      if (!existingEvent) {
        throw new Error('Event not found');
      }
      if (eventData.title) existingEvent.title = eventData.title;
      if (eventData.descrip) existingEvent.descrip = eventData.descrip;
      if (eventData.start) existingEvent.start = eventData.start;
      if (eventData.end) existingEvent.end = eventData.end;
      await existingEvent.save();
      return calendar.populate('events');
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(user: any, eventId: string): Promise<Calendar> {
    try {
      const calendar = await this.calendarModel
        .findOne({ user: user._id })
        .populate('events')
        .exec();
      if (!calendar) {
        throw new Error('Calendar not found');
      }
      const updatedEvents = calendar.events.filter(
        (e) => e._id.toString() !== eventId,
      );
      calendar.events = updatedEvents;
      await calendar.save();
      await this.eventModel.findByIdAndDelete(eventId).exec();
      return calendar;
    } catch (error) {
      throw new Error('Failed to delete event');
    }
  }

  async getEvents(user: any): Promise<Event[]> {
    try {
      const calendar = await this.calendarModel
        .findOne({ user: user._id })
        .populate('events')
        .exec();
      if (!calendar) {
        return [];
      }
      return calendar.events;
    } catch (error) {
      return [];
    }
  }
}
