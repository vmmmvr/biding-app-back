import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email } = createUserDto;
    const addedUser = await this.prismaService.user.findFirst({where: {email}});
    if(addedUser) {
      return addedUser;
    }
    return await this.prismaService.user.create({ data: {  name, email, },  include: {  bids: true, }, });
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany({
      include: {
        bids: true,
      },
    });
  }

  // Find a single user by ID
  async findOne(id: number): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { id },
      include: {
        bids: true,
      },
    });
  }

  // Update a user by ID
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        bids: true,
      },
    });
  }

  // Remove a user by ID
  async remove(id: number): Promise<User> {
    return await this.prismaService.user.delete({
      where: { id },
      include: {
        bids: true,
      },
    });
  }
}
