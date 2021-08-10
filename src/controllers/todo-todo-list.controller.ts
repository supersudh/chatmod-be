
// export class TodoTodoListController {
//   constructor(
//     @repository(TodoRepository)
//     public todoRepository: TodoRepository,
//   ) { }

//   @get('/todos/{id}/todo-list', {
//     responses: {
//       '200': {
//         description: 'TodoList belonging to Todo',
//         content: {
//           'application/json': {
//             schema: {type: 'array', items: getModelSchemaRef(TodoList)},
//           },
//         },
//       },
//     },
//   })
//   async getTodoList(
//     @param.path.number('id') id: typeof Todo.prototype.id,
//   ): Promise<TodoList> {
//     return this.todoRepository.todoList(id);
//   }
// }
