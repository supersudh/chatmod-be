import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors, param, post, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {DirectMessage} from '../models';
import {DirectMessageRepository} from '../repositories';
import {UserRepository} from '../repositories/user.repository';

@authenticate('jwt')
export class DirectMessageController {
  constructor(
    @repository(DirectMessageRepository)
    public directMessageRepository: DirectMessageRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/direct-messages')
  @response(200, {
    description: 'DirectMessage model instance',
    content: {'application/json': {schema: getModelSchemaRef(DirectMessage)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirectMessage, {
            title: 'NewDirectMessage',
            exclude: ['id', 'sender'],
          }),
        },
      },
    })
    directMessage: Omit<DirectMessage, 'id'>,
  ): Promise<DirectMessage> {
    try {
      // 1. validation -> Compute sender from currentUser
      const sender = Number(currentUserProfile[securityId]);
      const {receiver} = directMessage;
      if (receiver === sender) {
        throw new HttpErrors.UnprocessableEntity('You cannot send a message to yourself');
      }
      // 2. validation -> Ensure receiver exists in DB
      const {count: matchingCounts} = await this.userRepository.count({id: receiver});
      if (matchingCounts < 1) {
        throw new HttpErrors.UnprocessableEntity('receiver does not exist');
      }
      // 3. dbOp -> Create user in db and return created message object
      return this.directMessageRepository.create({
        ...directMessage,
        sender
      });
    } catch (error) {
      throw error;
    }
  }

  @get('/direct-messages')
  @response(200, {
    description: 'Get list of conversation with userId',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DirectMessage, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.query.string('userId', {
      description: 'Pass the id of the user to retrieve direct messages'
    }) userId: string,
  ): Promise<DirectMessage[]> {
    const currentUserId = Number(currentUserProfile[securityId]);
    if (Number(userId) === currentUserId) {
      throw new HttpErrors.UnprocessableEntity('userId is same as currentUserId');
    }
    const where = {
      and: [
        {or: [{sender: currentUserId}, {sender: Number(userId)}]},
        {or: [{receiver: currentUserId}, {receiver: Number(userId)}]}
      ]
    };
    return this.directMessageRepository.find({where});
  }

  // @get('/direct-messages/count')
  // @response(200, {
  //   description: 'DirectMessage model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(DirectMessage) where?: Where<DirectMessage>,
  // ): Promise<Count> {
  //   return this.directMessageRepository.count(where);
  // }

  // @get('/direct-messages')
  // @response(200, {
  //   description: 'Array of DirectMessage model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(DirectMessage, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(DirectMessage) filter?: Filter<DirectMessage>,
  // ): Promise<DirectMessage[]> {
  //   return this.directMessageRepository.find(filter);
  // }

  // @patch('/direct-messages')
  // @response(200, {
  //   description: 'DirectMessage PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(DirectMessage, {partial: true}),
  //       },
  //     },
  //   })
  //   directMessage: DirectMessage,
  //   @param.where(DirectMessage) where?: Where<DirectMessage>,
  // ): Promise<Count> {
  //   return this.directMessageRepository.updateAll(directMessage, where);
  // }

  // @get('/direct-messages/{id}')
  // @response(200, {
  //   description: 'DirectMessage model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(DirectMessage, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(DirectMessage, {exclude: 'where'}) filter?: FilterExcludingWhere<DirectMessage>
  // ): Promise<DirectMessage> {
  //   return this.directMessageRepository.findById(id, filter);
  // }

  // @patch('/direct-messages/{id}')
  // @response(204, {
  //   description: 'DirectMessage PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(DirectMessage, {partial: true}),
  //       },
  //     },
  //   })
  //   directMessage: DirectMessage,
  // ): Promise<void> {
  //   await this.directMessageRepository.updateById(id, directMessage);
  // }

  // @put('/direct-messages/{id}')
  // @response(204, {
  //   description: 'DirectMessage PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() directMessage: DirectMessage,
  // ): Promise<void> {
  //   await this.directMessageRepository.replaceById(id, directMessage);
  // }

  // @del('/direct-messages/{id}')
  // @response(204, {
  //   description: 'DirectMessage DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.directMessageRepository.deleteById(id);
  // }
}
