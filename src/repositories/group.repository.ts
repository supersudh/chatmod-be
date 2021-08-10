import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {ChatDbDataSource} from '../datasources';
import {Group, GroupRelations, GroupMessage} from '../models';
import {GroupMessageRepository} from './group-message.repository';

export class GroupRepository extends DefaultCrudRepository<
  Group,
  typeof Group.prototype.id,
  GroupRelations
> {

  public readonly groupMessages: HasManyRepositoryFactory<GroupMessage, typeof Group.prototype.id>;

  constructor(
    @inject('datasources.chatDb') dataSource: ChatDbDataSource, @repository.getter('GroupMessageRepository') protected groupMessageRepositoryGetter: Getter<GroupMessageRepository>,
  ) {
    super(Group, dataSource);
    this.groupMessages = this.createHasManyRepositoryFactoryFor('groupMessages', groupMessageRepositoryGetter,);
    this.registerInclusionResolver('groupMessages', this.groupMessages.inclusionResolver);
  }
}
