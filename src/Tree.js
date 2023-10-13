import Node from './Node';

export default class Tree {
  constructor(data) {
    this.index = -1;
    this.treeList = [];
    this.iterate([data]);

    const [root] = this.treeList;
    this.root = root;
  }

  iterate(data, node) {
    if (!data.length) return;

    let current = null;
    let index = 0;

    data.reduce((prev, next) => {
      const { children = [], ...others } = next;
      current = new Node(
        {
          id: (this.index += 1),
          index: (index += 1),
          length: children.length,
          level: node ? node.level + 1 : 0,
          parentId: node ? node.id : null,
          rawData: { ...others },
        },
        this.treeList
      );
      this.treeList.push(current);
      this.iterate(children, current);

      if (!prev) {
        if (node) node.firstId = current.id;
      } else {
        prev.nextId = current.id;
        current.prevId = prev.id;
      }

      return current;
    }, null);

    if (node) node.lastId = current.id;
  }

  find(nid) {
    if (Number.isNaN(nid)) return null;
    return this.treeList.find(({ id }) => id === nid);
  }

  static walk(node, cb) {
    let current = node;
    cb(current, 'first-enter');

    while (current) {
      if (current.firstId) {
        current = current.first();
        cb(current, 'first-enter');
      } else {
        cb(current, 'exit');

        if (current.nextId) {
          current = current.next();
          cb(current, 'sibling-enter');
        } else if (!Number.isNaN(current.parentId)) {
          current = current.parent();

          while (current) {
            cb(current, 'exit');

            if (current.nextId) {
              current = current.next();
              cb(current, 'parent-sibling-enter');
              break;
            } else {
              current = current.parent();
            }
          }
        } else {
          break;
        }
      }
    }

    return node;
  }
}
