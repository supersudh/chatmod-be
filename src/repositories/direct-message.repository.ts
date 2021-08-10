import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ChatDbDataSource} from '../datasources';
import {DirectMessage, DirectMessageRelations} from '../models';

export class DirectMessageRepository extends DefaultCrudRepository<
  DirectMessage,
  typeof DirectMessage.prototype.id,
  DirectMessageRelations
> {
  constructor(
    @inject('datasources.chatDb') dataSource: ChatDbDataSource,
  ) {
    super(DirectMessage, dataSource);
  }
}
