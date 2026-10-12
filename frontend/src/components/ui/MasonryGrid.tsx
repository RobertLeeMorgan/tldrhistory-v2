import { useCallback, useSyncExternalStore } from "react";
import { Masonry } from "masonic";

const subscribeToHydration = () => () => {};

type MasonryGridProps<Item> = {
  items: Item[];
  getItemKey: (item: Item, index: number) => React.Key;
  renderCard: (item: Item) => React.ReactNode;
};

export default function MasonryGrid<Item>({ items, getItemKey, renderCard }: MasonryGridProps<Item>) {
  const isEnhanced = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const render = useCallback(
    ({ data, width }: { data: Item; width: number }) => (
      <div style={{ width }} className="min-w-0">{renderCard(data)}</div>
    ),
    [renderCard],
  );

  if (!isEnhanced) {
    return (
      <div className="columns-1 gap-6 md:columns-2 min-[1440px]:columns-3">
        {items.map((item, index) => (
          <div key={getItemKey(item, index)} className="mb-6 break-inside-avoid">
            {renderCard(item)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Masonry
      items={items}
      itemKey={getItemKey}
      columnGutter={24}
      columnWidth={300}
      itemHeightEstimate={420}
      maxColumnCount={3}
      render={render}
    />
  );
}
