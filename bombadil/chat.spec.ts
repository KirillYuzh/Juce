import { always } from '@antithesishq/bombadil';
import { actions, extract } from '@antithesishq/bombadil/browser';

export * from '@antithesishq/bombadil/browser/defaults';

export const waitForStory = actions(() => ['Wait']);

const listBounds = extract((state) => {
  const list = state.document.querySelector('[data-chat-list-scroll]');
  if (!list) return null;
  const rect = list.getBoundingClientRect();
  return rect.width > 0 ? { left: rect.left, right: rect.right } : null;
});

const listOverflow = extract((state) => {
  const list = state.document.querySelector<HTMLElement>('[data-chat-list-scroll]');
  return list === null ? 0 : list.scrollWidth - list.clientWidth;
});

const rowBounds = extract((state) =>
  Array.from(state.document.querySelectorAll<HTMLElement>('[data-chat-item]')).map((item) => {
    const rect = item.getBoundingClientRect();
    return { left: rect.left, right: rect.right };
  })
);

const pageOverflow = extract(
  (state) => state.document.documentElement.scrollWidth - state.document.documentElement.clientWidth
);

export const chatListHasNoHorizontalScroll = always(() => listOverflow.current <= 1);

export const chatRowsStayInsideList = always(() => {
  const bounds = listBounds.current;
  if (!bounds) return true;
  return rowBounds.current.every(
    (row) => row.left >= bounds.left - 0.5 && row.right <= bounds.right + 0.5
  );
});

export const pageHasNoHorizontalOverflow = always(() => pageOverflow.current <= 1);
