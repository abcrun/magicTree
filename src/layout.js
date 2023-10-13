import Tree from './Tree';

function getNodeWidthOrHeight(node, v) {
  switch (typeof v) {
    case 'function':
      return v(node);
    case 'number':
      return v;
    default:
      return 20;
  }
}

export function walk(root, options) {
  Tree.walk(root, (node, status) => {
    const { width: w, height: h, direction = 'horizontal', offset } = options;
    const width = getNodeWidthOrHeight(node, w);
    const height = getNodeWidthOrHeight(node, h);
    let top = 0;
    let left = 0;
    const pos = { top, left, width, height };

    if (status === 'first-enter') {
      const parent = (node.parent() || {}).pos;

      if (direction === 'horizontal') {
        pos.left = parent ? parent.left + parent.width / 2 - width / 2 : 0;
        pos.top = parent ? parent.top + parent.height + offset.y : 0;
      } else {
        pos.top = parent ? parent.top + parent.height / 2 - height / 2 : 0;
        pos.left = parent ? parent.left + parent.width + offset.x : 0;
      }

      node.pos = pos;
    } else if (status === 'sibling-enter') {
      const prev = node.prev().pos;

      if (direction === 'horizontal') {
        pos.left = prev.left + prev.width + offset.x;
        pos.top = prev.top;
      } else {
        pos.top = prev.top + prev.height + offset.y;
        pos.left = prev.left;
      }

      node.pos = pos;
    } else if (status === 'parent-sibling-enter') {
      let prev = node.prev();
      let last = prev.last();

      const t = true;
      while (t) {
        const current = last.last();
        if (!current) break;

        last = current;
      }
      prev = prev.pos;
      last = last.pos;

      if (direction === 'horizontal') {
        const lastRight = last.left + last.width;
        const prevRight = prev.left + prev.width;

        pos.left = (lastRight > prevRight ? lastRight : prevRight) + offset.x;
        pos.top = prev.top;
      } else {
        const lastBottom = last.top + last.height;
        const prevBottom = prev.top + prev.height;

        pos.top =
          (lastBottom > prevBottom ? lastBottom : prevBottom) + offset.y;
        pos.left = prev.left;
      }

      node.pos = pos;
    } else if (status === 'exit') {
      if (node.length) {
        if (node.length === 1) {
          const first = node.first().pos;

          if (direction === 'horizontal') {
            pos.left = first.left + first.width / 2 - width / 2;
            pos.top = node.pos.top;
          } else {
            pos.top = first.top + first.height / 2 - height / 2;
            pos.left = node.pos.left;
          }
        } else {
          const first = node.first().pos;
          const last = node.last().pos;

          if (direction === 'horizontal') {
            left =
              first.left +
              (last.left + last.width - first.left) / 2 -
              width / 2;
            top = first.top - offset.y - height;
          } else {
            top =
              first.top + (last.top + last.height - first.top) / 2 - height / 2;
            left = first.left - offset.x - width;
          }

          pos.left = left;
          pos.top = top;
        }

        node.pos = pos;
      }
    }
  });
}

export default function layout(tree, options) {
  walk(tree.root, options);

  return tree;
}
