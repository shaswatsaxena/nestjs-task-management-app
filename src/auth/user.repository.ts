import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { authCredentialsDto } from './dto/authCredentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp({ username, password }: authCredentialsDto): Promise<void> {
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    await user.save();
  }
}
