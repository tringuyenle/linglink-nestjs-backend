import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';

describe('MessageController', () => {
  let app: INestApplication;
  let messageService = { getMessage: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        { provide: MessageService, useValue: messageService },
      ],
    })
    .overrideGuard(MyJwtGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/message (GET)', () => {
    const user = { id: 1, username: 'test' };
    const chatRoomId = '123';
    const result = { message: 'test message' };
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0In0.-uSn3jsNvwbFh4Ji60rgSZbZ6NOKjn6lYcNRaRinhcI'; 

    messageService.getMessage.mockResolvedValue(result);

    return request(app.getHttpServer())
        .get('/message')
        .query({ chatRoomId })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual(result);
        });
  });

  afterEach(async () => {
    await app.close();
  });
});