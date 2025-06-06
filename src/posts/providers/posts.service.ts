import { PatchPostDto } from './../dtos/patch-post.dto';
import { TagsService } from './../../tags/providers/tags.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { waitForDebugger } from 'inspector';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import { CreatePostProvider } from './create-post.provider.ts';

@Injectable()
export class PostsService {
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

    // inject create post provider
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
  }

  /**
   * Method to find all posts
   */
  public async findAll(userId: string) {
    // find all posts
    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        // tags: true,
      },
    });

    return posts;
  }

  /**
   * Method to delete a post from the database
   */
  public async delete(id: number) {
    // Find the post from the database
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }

  /**
   * Method to Update a post
   */
  public async update(patchPostDto: PatchPostDto) {
    // Find new tags
    let tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

    // Update the post
    let post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    // Update the tags
    post.tags = tags;

    return await this.postsRepository.save(post);
  }
}
