import { types } from 'mobx-state-tree';

const Template = types
  .model('template', {
    _id: types.optional(types.string, ''),
    project_id: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    type: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    cover: types.optional(types.string, ''),
    order: types.optional(types.number, 0),
    creaatedAt: types.optional(types.string, ''),
    updatedAt: types.optional(types.string, ''),
    attrs: types.frozen({}),
    style: types.frozen({}),
    children: types.frozen({})
  })
  .actions(self => ({

  }))
  .views(self => ({

  }));

export default Template;