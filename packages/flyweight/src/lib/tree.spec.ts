import { createTreeFactory } from './tree';

describe('flyweightTree', () => {
  it('creates trees with correct values', () => {
    const name = 'bandaid';
    const color = 'fire';
    const texture = new Blob(['hello']);
    const treeFactory = createTreeFactory();
    const x = 15;
    const y = 25;

    const t1 = treeFactory(x, y, name, color, texture);

    expect(t1.type.texture).toEqual(texture);
    expect(t1.type.color).toEqual(color);
    expect(t1.type.name).toEqual(name);
  });

  it('creates trees with shared types', () => {
    const sharedName = 'woods';
    const sharedColor = 'autumnul';
    const sharedTexture = new Blob(['hi']);

    const tree1Coords = { x: 15, y: 25 };
    const tree2Coords = { x: 7, y: 13 };

    const treeFactory = createTreeFactory();

    const t1 = treeFactory(
      tree1Coords.x,
      tree1Coords.y,
      sharedName,
      sharedColor,
      sharedTexture
    );
    const t2 = treeFactory(
      tree2Coords.x,
      tree2Coords.y,
      sharedName,
      sharedColor,
      sharedTexture
    );

    expect(t1.type).toEqual(t2.type);
  });
});

