import {Entity, model, property} from '@loopback/repository';

@model()
export class DirectMessage extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  sender: number;

  @property({
    type: 'number',
    required: true,
  })
  receiver: number;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      type: 'datetime',
      default: 'CURRENT_TIMESTAMP'
    }
  })
  createdAt?: string;


  constructor(data?: Partial<DirectMessage>) {
    super(data);
  }
}

export interface DirectMessageRelations {
  // describe navigational properties here
}

export type DirectMessageWithRelations = DirectMessage & DirectMessageRelations;
