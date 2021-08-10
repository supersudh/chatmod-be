import {Entity, model, property, hasMany} from '@loopback/repository';
import {GroupMessage} from './group-message.model';

@model()
export class Group extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    mysql: {
      type: 'datetime',
      default: 'CURRENT_TIMESTAMP'
    }
  })
  createdAt?: string;

  @hasMany(() => GroupMessage)
  groupMessages: GroupMessage[];

  constructor(data?: Partial<Group>) {
    super(data);
  }
}

export interface GroupRelations {
  // describe navigational properties here
}

export type GroupWithRelations = Group & GroupRelations;
