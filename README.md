# Стоп-лист кухни

Тестовое задание для Coperto (Middle Frontend Developer). Next.js 16 (App Router), TypeScript strict, TanStack Query, Zustand, Tailwind, React Hook Form + Zod, Framer Motion, Vitest.

## Запуск

```bash
npm install
npm run dev
npm run test
```

## Слои

Серверные компоненты: `layout.tsx`, `page.tsx`, route handler'ы в `app/api/**`. Всё остальное — клиентское (`'use client'`): формы, мутации, Zustand, фильтры через `next/navigation`. `StopListPage` — клиентская прослойка между серверным `page.tsx` (читает `searchParams`) и `useQuery` (работает только на клиенте)

`server/menu-store.ts` — in-memory хранилище, доступно только route handler'ам. Данные не переживают рестарт serverless-инстанса на Vercel — ожидаемо для мокового API.

## Архитектурные решения

Фильтрация — на клиенте, не через API: данных мало, `queryKey` не зависит от фильтров, что упрощает оптимистичные обновления (один кэш вместо инвалидации по комбинациям). Мутации возвращают discriminated union (`{ok: true, item} | {ok: false, reason}`) вместо `null`/`throw`, чтобы route handler однозначно мапил причину на HTTP-статус. Zustand хранит только `id` открытой позиции — серверные данные не дублируются.

## Допущения

- `Button`/`Select`/`Badge`/`Toast` написаны с нуля — не стал использовать ни shadcn/ui, ни react-hot-toast, хотя формальный запрет в ТЗ касается только UI-китов уровня MUI/Ant Design но решил что нужно написать именно свой ui-kit + что бы не тащить лишние зависимости в package.json килобайты в бандл.

## Что доделал бы

- Тесты на `filterMenuItems`/`validateUntil` и вторую мутацию (`useResumeItem`).
- Клавиатурная навигация в таблице (стрелки, Enter).
