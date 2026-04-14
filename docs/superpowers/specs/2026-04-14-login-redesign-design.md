# Login Redesign Design

## Context

The current `/login` page already supports the required business flow, but the page reads more like a plain form than a premium brand entry point. Brand text, fields, CTA, helper copy, and agreement all compete on the same visual level, so the first screen lacks focus and atmosphere.

This redesign should continue the Apple-inspired visual system from `design.md`: restrained light background, precise display typography, generous spacing, soft white surfaces, and blue reserved for interaction. The page should feel quieter and more refined, not more decorative.

## Goal

Rebuild `/login` as a static, premium, mobile-first entry page that improves hierarchy and perceived quality while preserving the existing SMS-code login flow exactly as it works today.

## Approved Direction

- Overall mood: quiet luxury minimalism
- Hero direction: material-led hero
- Layout direction: `A` vertical editorial composition
- Scope: visual redesign only; no new login methods

## Page Structure

### 1. Material Hero

- Add a restrained top hero area that behaves like a still-life display rather than a marketing banner.
- The hero should use a product or material-inspired composition with light, soft tones that fit the jewelry / premium retail tone.
- The hero carries atmosphere only. It should not introduce extra actions, tabs, or operational copy.

### 2. Welcome Copy

- Place a short welcome block below the hero.
- Keep copy minimal: one strong headline and one short supporting sentence.
- The headline should frame the page as a return point for existing users, not as a generic utility screen.

### 3. Login Card

- Place the existing mobile number and SMS verification form inside one elevated card.
- Make the card the clearest functional focus on the page.
- Inputs should feel quieter and more premium: cleaner spacing, softer separators, better field rhythm.
- Keep the verification-code trigger inside the field as a secondary action.
- Keep the submit button as the only dominant CTA on the page.

### 4. Supporting Information

- Keep “手机号未注册将自动创建账号” as secondary supporting copy below the card.
- Keep the agreement checkbox and legal copy at the bottom with reduced visual weight but clear readability.

## Preserved Behavior

- Preserve phone validation rules.
- Preserve SMS code sending, countdown state, and loading behavior.
- Preserve agreement acceptance validation before submit.
- Preserve `user/login` dispatch, address preload, and success redirect to home.
- Do not add password login, social login, or tab switching.

## Visual Rules

- Use a light gray page background with one calm visual hero and one white login card.
- Avoid deep black full-page treatment for this screen.
- Keep interaction color in the existing blue family; do not introduce a new brand accent just for login.
- Use display typography for the welcome headline and quieter text styling for helper and agreement copy.
- Prefer one or two soft entrance motions at most; avoid noisy animation.

## Implementation Boundaries

- Reuse existing assets where possible. If a suitable image is unavailable, create the hero atmosphere with CSS layers rather than adding heavy new dependencies.
- Keep the page as a single-column mobile layout.
- Focus changes inside `src/views/auth/login.vue` unless a small shared style extraction is clearly justified.

## Acceptance Criteria

- At 390px width, the first screen clearly reads as: hero, welcome, login action.
- The form remains easy to scan and complete.
- Verification-code countdown, agreement validation, and login success flow continue to work unchanged.
- `npm run lint` has no new errors.
- Browser verification confirms no new console warnings on `/login`.
