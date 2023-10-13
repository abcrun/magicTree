export default class Node {
  constructor(data, tree) {
    const { id, index, parentId, level, length, rawData } = data;
    this.id = id;
    this.index = index;
    this.parentId = parentId;
    this.level = level;
    this.length = length;
    this.rawData = rawData;

    this.firstId = null;
    this.lastId = null;
    this.nextId = null;
    this.prevId = null;

    this.tree = tree;
  }

  find(nid) {
    if (Number.isNaN(nid)) return null;
    return this.tree.find(({ id }) => id === nid);
  }

  parent() {
    return this.find(this.parentId);
  }

  prev() {
    return this.find(this.prevId);
  }

  next() {
    return this.find(this.nextId);
  }

  first() {
    return this.find(this.firstId);
  }

  last() {
    return this.find(this.lastId);
  }

  children() {
    return this.tree.filter(({ parentId }) => parentId === this.id);
  }
}
