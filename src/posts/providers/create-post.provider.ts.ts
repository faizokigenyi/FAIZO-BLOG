import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';

@Injectable()
export class CreatePostProvider {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Injecting Tags service
     */
    private readonly tagsService: TagsService,
  ) {}
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author;
    let tags;
    try {
      author = await this.usersService.findOneById(user.sub);
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error, {
        description: '',
      });
    }

    if (createPostDto.tags.length !== tags.length) {
      throw new BadRequestException('Check your tag Ids');
    }
    // Create the post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      return await this.postsRepository.save(post);
    } catch (err) {
      throw new ConflictException(err, {
        description: 'duplicate ',
      });
    }
  }
}
