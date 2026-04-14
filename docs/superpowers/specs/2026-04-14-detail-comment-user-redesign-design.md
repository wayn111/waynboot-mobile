# Detail Comment User Redesign Design

## Context

The product detail page, product comment page, and user center still rely on older Vant-first page composition. Core business behavior is already available, but the visual hierarchy is weak: modules feel stacked rather than orchestrated, the first screen does not clearly communicate the primary action, and the three pages do not share one coherent visual language.

This redesign continues the existing Apple-inspired direction from [`DESIGN.md`](/E:/GitRepo/waynboot-mobile/DESIGN.md): light gray page background, restrained white cards, large display typography, limited blue accents, and occasional dark sections only where they strengthen focus.

## Goal

Rebuild `/detail/:goodsId`, `/detail/comment/:goodsId/:tagType`, and `/user` into a clearer mobile-first experience that feels premium and direct without changing current APIs, route contracts, SKU behavior, comment behavior, or user/account flows.

## Approved Direction

- Overall visual strategy: `B` Conversion Gallery
- Detail page priority: `A` conversion-first
- Comment page priority: `B` reading-first
- User page priority: `A` account-first

## Shared Principles

1. Every first screen must answer the page’s main question without scrolling.
2. Strong hero blocks should replace generic stacked cells.
3. Blue is reserved for actions, counts, and selected states only.
4. Detail, comment, and account pages should feel related through typography, spacing, and card rhythm, not by repeating the same layout.

## Page Design

### `/detail/:goodsId`

- Use one conversion-first hero combining media and purchase summary.
- Keep `Swiper` as the product visual anchor, but pair it immediately with title, brief copy, price, crossed price, sales, and lightweight trust cues.
- Move the purchase decision closer to the top: the first screen should already suggest selecting SKU or buying now.
- Convert the current `Section` into a purchase configuration card covering SKU, attributes, shipping address, and freight threshold.
- Convert the current `Comment` block into a compact reputation card: summary first, then one to two highlighted reviews.
- Convert the `Description` block into a cleaner editorial gallery section so long content feels intentional rather than appended.
- Keep current SKU popup, WeChat share behavior, cart count refresh, and route flow intact.

### `/detail/comment/:goodsId/:tagType`

- Lead with a rating summary card instead of immediately exposing dense filter tags.
- Surface good-rate, total count, picture-review count, and a short summary sentence before the tag bar.
- Treat tags as the second layer of interaction: users should first understand the overall review quality, then drill down.
- Keep the existing tag filter and pagination logic, but present comments with better reading rhythm: stronger author header, cleaner image grid, softer admin reply treatment.
- Preserve `getCommentTagNum`, `getCommentList`, current route params, and infinite loading behavior.

### `/user`

- Turn the top section into an account hero card with avatar, nickname, ID, settings entry, and a short status line.
- Add lightweight account metrics under the identity block, such as coupon count or pending orders, but only from already available data.
- Rebuild `Order` into a service card with “my orders” as the headline and the existing four states as action shortcuts.
- Rebuild `Tools` into a calmer account settings list with grouped spacing and stronger hierarchy.
- Keep current store-based user info, order status counts, settings navigation, coupon/address links, and logout flow unchanged.

## Implementation Boundaries

- Preserve current APIs and existing data sources.
- Preserve current route paths, params, and business actions.
- Restructure page-level modules freely when it improves readability and maintainability.
- Prefer targeted module rewrites over touching unrelated flows.

## Acceptance Criteria

- Detail page still loads goods detail, comments summary, mall config, SKU popup, and share behavior correctly.
- Comment page still supports tag switching, pagination, and comment rendering without route regressions.
- User page still shows user info, order status counts, settings links, and logout behavior.
- First-pass mobile layout at 390px width shows clear first-screen hierarchy on all three pages.
- `npm run lint` has no new errors.
- `npm run build:prod` succeeds.
- Browser verification confirms the three pages render without new console warnings.
