import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {ChatDbDataSource} from '../datasources';
import {GroupMessage, GroupMessageRelations} from '../models';
import {User} from '../models/user.model';
import {UserRepository} from './user.repository';

export class GroupMessageRepository extends DefaultCrudRepository<
  GroupMessage,
  typeof GroupMessage.prototype.id,
  GroupMessageRelations
> {

  public readonly sender: BelongsToAccessor<User, typeof User.prototype.id>;

  constructor(
    @inject('datasources.chatDb') dataSource: ChatDbDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(GroupMessage, dataSource);
    this.sender = this.createBelongsToAccessorFor('sender', userRepositoryGetter);
    this.registerInclusionResolver('sender', this.sender.inclusionResolver);
  }
}
