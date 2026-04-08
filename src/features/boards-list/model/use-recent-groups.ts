import { ApiSchemas } from "@/shared/api/schema";

const GROUP_TITLES = {
  TODAY: "Сегодня",
  YESTERDAY: "Вчера",
  LAST_MONTH: "Прошлый месяц",
  OTHER: "Другое",
} as const;

const GROUP_ORDER = [
  GROUP_TITLES.TODAY,
  GROUP_TITLES.YESTERDAY,
  GROUP_TITLES.LAST_MONTH,
  GROUP_TITLES.OTHER,
];

type BoardsGroup = {
  title: string;
  items: ApiSchemas["Board"][];
};

export function useRecentGroups(boards: ApiSchemas["Board"][]): BoardsGroup[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const groups = boards.reduce<BoardsGroup[]>((acc, board) => {
    const lastOpenedAt = new Date(board.lastOpenedAt);
    lastOpenedAt.setHours(0, 0, 0, 0);

    let groupTitle: string;
    if (lastOpenedAt.getTime() === today.getTime()) {
      groupTitle = GROUP_TITLES.TODAY;
    } else if (lastOpenedAt.getTime() === yesterday.getTime()) {
      groupTitle = GROUP_TITLES.YESTERDAY;
    } else if (lastOpenedAt >= lastMonth) {
      groupTitle = GROUP_TITLES.LAST_MONTH;
    } else {
      groupTitle = GROUP_TITLES.OTHER;
    }

    const group = acc.find((g) => g.title === groupTitle);
    if (group) {
      group.items.push(board);
    } else {
      acc.push({ title: groupTitle, items: [board] });
    }

    return acc;
  }, []);

  return GROUP_ORDER
    .map((title) => groups.find((g) => g.title === title))
    .filter((group): group is BoardsGroup => group !== undefined);
}
