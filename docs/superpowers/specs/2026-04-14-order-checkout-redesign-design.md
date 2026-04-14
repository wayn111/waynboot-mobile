# Order Checkout Flow Redesign Design

## Context

The current checkout flow spans [`/order/confirm`](/E:/GitRepo/waynboot-mobile/src/views/order/confirm/index.vue), [`/order/pay`](/E:/GitRepo/waynboot-mobile/src/views/order/pay/index.vue), and [`/order/payStatus`](/E:/GitRepo/waynboot-mobile/src/views/order/payStatus/index.vue). Functionally the flow works, but the pages still look like legacy Vant back-office forms rather than a single mobile-first purchase journey.

This redesign follows [`DESIGN.md`](/E:/GitRepo/waynboot-mobile/DESIGN.md): light gray page background, restrained white cards, large typography, Apple Blue only for actions, and no decorative gradients or noisy accent blocks.

## Goal

Create one coherent "review -> pay -> receipt" flow that feels fast, calm, and deliberate on mobile while preserving all existing APIs and business timing.

## Approved Direction

- Overall tone: `A` Quick Checkout
- Confirm page density: `2` Standard
- Cancel status handling: `3` Lightweight separate state

## Flow Principles

1. The shortest path to completion must stay obvious on every page.
2. Information should be grouped into a few strong cards instead of many small utility rows.
3. Large titles and spacing create hierarchy; color should not do that work.
4. Status pages should feel like receipts, not marketing posters.

## Page Design

### `/order/confirm`

- Use a clean summary-first layout on `#f5f5f7`.
- Top area is a compact title block only; no long helper copy.
- Address becomes the first primary card and remains the main editable object.
- Goods are presented as a concise summary card with image, title, specs, quantity, and subtotal.
- Coupon, freight, and remark move into one "order settings" card to reduce visual fragmentation.
- Bottom fixed settlement dock shows final amount on the left and a single `提交订单` CTA on the right.

### `/order/pay`

- Replace notice-bar and cell-group styling with a single payment summary surface.
- Show amount first, then order number and a lightweight payment deadline hint.
- Payment methods become large tappable selection cards; entire row is clickable.
- `wx` and `ali` stay primary options; `test` remains available but visually down-ranked.
- Bottom fixed CTA becomes `确认支付`.

### `/order/payStatus`

- Use one shared receipt layout with status-driven copy and actions.
- `success`: calm success receipt, primary action `查看订单`, secondary action `返回首页`.
- `failed`: neutral failure receipt, primary action `重新支付`, secondary action `查看订单`.
- `cancel`: lighter interruption page, not treated as failure; primary action returns to order detail/list and secondary action can return home.
- All three states share the same structure so only meaning changes, not the whole visual skeleton.

## Business Constraints

- Keep current route contracts and query usage.
- Keep existing order submission, polling, prepay, and redirect logic.
- Keep current coupon selection, remark input, and selected address behavior.
- Do not introduce new backend fields or new API dependencies.

## Implementation Boundaries

- Restructure view composition and modules as needed for readability.
- Preserve validation behavior for missing address, empty cart, missing order number, and missing payment method.
- Keep Vant where it is useful for behavior, but replace default Vant page chrome with custom layout and styling.

## Acceptance Criteria

- `/order/confirm` still accepts selected cart ids, can submit, and still reaches `/order/pay`.
- `/order/pay` still supports `wx`, `ali`, and `test` paths without changing API semantics.
- `/order/payStatus` renders correct copy and actions for `success`, `failed`, and `cancel`.
- Mobile first-pass at 390px width has no obvious layout crowding.
- `npm run lint` has no new errors.
- `npm run build:prod` succeeds.
- Browser verification confirms the three pages render without new console warnings.
