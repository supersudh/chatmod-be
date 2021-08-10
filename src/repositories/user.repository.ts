import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {ChatDbDataSource} from '../datasources';
import {User, UserRelations} from '../models';
import {UserCredentials} from '../models/user-credentials.model';
import {UserCredentialsRepository} from './user-credentials.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof UserCredentials.prototype.id>;

  constructor(
    @inject('datasources.chatDb') dataSource: ChatDbDataSource,
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter,);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
