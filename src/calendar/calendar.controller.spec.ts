import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { Calendar } from 'schemas/calendar.schema';
import { ClientSession } from 'mongodb';
import { Document, Model, DocumentSetOptions, QueryOptions, UpdateQuery, AnyObject, PopulateOptions, MergeType, Query, SaveOptions, ToObjectOptions, FlattenMaps, Require_id, UpdateWithAggregationPipeline, pathsToSkip, Error, Types } from 'mongoose';

jest.mock('./calendar.service');

describe('CalendarController', () => {
  let controller: CalendarController;
  let service: jest.Mocked<CalendarService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        {
          provide: CalendarService,
          useValue: {
            createEvent: jest.fn(),
            updateEvent: jest.fn(),
            deleteEvent: jest.fn(),
            getEvents: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(MyJwtGuard)
    .useValue({ canActivate: jest.fn().mockReturnValue(true) })
    .compile();

    controller = module.get<CalendarController>(CalendarController);
    service = module.get(CalendarService);
  });

  it('should create an event', async () => {
    const event : any = {
        user: new Types.ObjectId(),
        events: [],
    };
    const req = { user: event.user._id.toString() };

    service.createEvent.mockResolvedValue(event);

    expect(await controller.createEvent(req, event)).toBe(event);
    expect(service.createEvent).toHaveBeenCalledWith(req.user, event);
  });

  it('should update an event', async () => {
    const req = { user: { id: '1' } };
    const event : any = {
        user: new Types.ObjectId(),
        events: [],
    };    
    const eventId = '1';
    service.updateEvent.mockResolvedValue(event);

    expect(await controller.updateEvent(req, eventId, event)).toBe(event);
    expect(service.updateEvent).toHaveBeenCalledWith(req.user, eventId, event);
  });

  it('should delete an event', async () => {
    const req = { user: { id: '1' } };
    const eventId = '1';
    const event : any = {
        user: new Types.ObjectId(),
        events: [],
    };

    service.deleteEvent.mockResolvedValue(event);

    expect(await controller.deleteEvent(req, eventId)).toEqual(event);
    expect(service.deleteEvent).toHaveBeenCalledWith(req.user, eventId);
  });

  it('should get events', async () => {
    const req = { user: { id: '1' } };
    const events : any = [{
        user: new Types.ObjectId(),
        events: [],
    }];
    service.getEvents.mockResolvedValue(events);

    expect(await controller.getEvents(req)).toBe(events);
    expect(service.getEvents).toHaveBeenCalledWith(req.user);
  });
});