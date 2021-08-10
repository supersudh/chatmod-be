import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class GroupMessage extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @belongsTo(() => User)
  senderId: number;

  @property({
    type: 'number',
    required: true,
  })
  groupId: number;

  @property({
    type: 'date',
    mysql: {
      type: 'datetime',
      default: 'CURRENT_TIMESTAMP'
    }
  })
  createdAt?: string;


  constructor(data?: Partial<GroupMessage>) {
    super(data);
  }
}

export interface GroupMessageRelations {
  // describe navigational properties here
}

export type GroupMessageWithRelations = GroupMessage & GroupMessageRelations;
