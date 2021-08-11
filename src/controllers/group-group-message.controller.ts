import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {
  Group,
  GroupMessage
} from '../models';
import {GroupRepository} from '../repositories';

@authenticate('jwt')
export class GroupGroupMessageController {
  constructor(
    @repository(GroupRepository) protected groupRepository: GroupRepository,
  ) { }

  @get('/groups/{id}/group-messages', {
    responses: {
      '200': {
        description: 'Array of Group has many GroupMessage',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GroupMessage)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<GroupMessage>,
  ): Promise<{data: GroupMessage[]}> {
    return {
      data: await this.groupRepository.groupMessages(id).find(filter)
    };
  }

  @post('/groups/{id}/group-messages', {
    responses: {
      '200': {
        description: 'Group model instance',
        content: {'application/json': {schema: getModelSchemaRef(GroupMessage)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Group.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GroupMessage, {
            title: 'NewGroupMessageInGroup',
            exclude: ['id', 'createdAt', 'groupId', 'senderId'],
            // optional: ['groupId']
          }),
        },
      },
    }) groupMessage: Omit<GroupMessage, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<{data: GroupMessage}> {
    const sender = Number(currentUserProfile[securityId]);

    return {
      data: await this.groupRepository.groupMessages(id).create({
        ...groupMessage,
        senderId: sender
      })
    };
  }

  // @patch('/groups/{id}/group-messages', {
  //   responses: {
  //     '200': {
  //       description: 'Group.GroupMessage PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async patch(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(GroupMessage, {partial: true}),
  //       },
  //     },
  //   })
  //   groupMessage: Partial<GroupMessage>,
  //   @param.query.object('where', getWhereSchemaFor(GroupMessage)) where?: Where<GroupMessage>,
  // ): Promise<Count> {
  //   return this.groupRepository.groupMessages(id).patch(groupMessage, where);
  // }

  // @del('/groups/{id}/group-messages', {
  //   responses: {
  //     '200': {
  //       description: 'Group.GroupMessage DELETE success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async delete(
  //   @param.path.number('id') id: number,
  //   @param.query.object('where', getWhereSchemaFor(GroupMessage)) where?: Where<GroupMessage>,
  // ): Promise<Count> {
  //   return this.groupRepository.groupMessages(id).delete(where);
  // }
}
