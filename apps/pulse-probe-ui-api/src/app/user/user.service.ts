import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto';
import { CatchServiceErrors } from '../common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  @CatchServiceErrors()
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  @CatchServiceErrors()
  async create(userData: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  @CatchServiceErrors()
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  @CatchServiceErrors()
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  @CatchServiceErrors()
  async deleteById(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
