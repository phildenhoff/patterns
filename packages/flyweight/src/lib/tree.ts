export type TreeType = {
  name: string;
  color: string;
  texture: Blob;
};

export type Tree = {
  type: TreeType;
  x: number;
  y: number;
};

export type TreeConstructor = (
  x: Tree['x'],
  y: Tree['y'],
  name: TreeType['name'],
  color: TreeType['color'],
  texture: TreeType['texture']
) => Tree;

export const createTreeFactory = (): TreeConstructor => {
  const types: TreeType[] = [];

  const addType = (
    name: TreeType['name'],
    color: TreeType['color'],
    texture: TreeType['texture']
  ): TreeType => types[types.push({ name, color, texture }) - 1];

  return (x, y, name, color, texture) => {
    const type =
      types.find(
        (item) =>
          item.name === name && item.color === color && item.texture === texture
      ) || addType(name, color, texture);

    return {
      type,
      x,
      y,
    };
  };
};
