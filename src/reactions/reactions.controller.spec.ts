import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { HttpStatus } from '@nestjs/common';
import { ReactionCommentDTO, ReactionPostDTO } from './dto/reaction.dto';

describe('ReactionsController', () => {
    let controller: ReactionsController;
    let service: ReactionsService;

    beforeEach(async () => {
        service = new ReactionsService(null);
        controller = new ReactionsController(service);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should like a post', async () => {
        const result = HttpStatus.OK;
        const react: ReactionPostDTO = { postId: '1' };
        jest.spyOn(service, 'likePost').mockImplementation(() => Promise.resolve(result));
        expect(await controller.likePost({ user: 'user1' }, react)).toBe(result);
    });

    it('should dislike a post', async () => {
        const result = HttpStatus.OK;
        const react: ReactionPostDTO = { postId: '1' };
        jest.spyOn(service, 'dislikePost').mockImplementation(() => Promise.resolve(result));
        expect(await controller.dislikePost({ user: 'user1' }, react)).toBe(result);
    });

    it('should like a comment', async () => {
        const result = HttpStatus.OK;
        const react: ReactionCommentDTO = { commentId: '1' };
        jest.spyOn(service, 'likeComment').mockImplementation(() => Promise.resolve(result));
        expect(await controller.likeComment({ user: 'user1' }, react)).toBe(result);
    });

    it('should dislike a comment', async () => {
        const result = HttpStatus.OK;
        const react: ReactionCommentDTO = { commentId: '1' };
        jest.spyOn(service, 'dislikeComment').mockImplementation(() => Promise.resolve(result));
        expect(await controller.dislikeComment({ user: 'user1' }, react)).toBe(result);
    });

    it('should get reaction by post id', async () => {
        const result = { likeUsers: [], dislikeUsers: [] };
        jest.spyOn(service, 'getReactionByPostId').mockImplementation(() => Promise.resolve(result));
        expect(await controller.getReactionByPostId('1')).toBe(result);
    });

    it('should get reaction by comment id', async () => {
        const result = { likeUsers: [], dislikeUsers: [] };
        jest.spyOn(service, 'getReactionByCommentId').mockImplementation(() => Promise.resolve(result));
        expect(await controller.getReactionByCommentId('1')).toBe(result);
    });
});