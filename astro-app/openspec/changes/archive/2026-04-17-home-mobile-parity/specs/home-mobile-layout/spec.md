## MODIFIED Requirements

### Requirement: Mobile scope includes static navigation, shorter map, and Resources/News carousels
The mobile layout SHALL include the box grid, the shorter map, AND the SPA's Resources and News carousels. The previously deferred carousels are now in scope, implemented as a small purpose-built React island (no Swiper / `react-swipeable-views` dependency). The SPA's `regionalPageMobilePopUp` dialog remains an explicit non-goal.

#### Scenario: Resources carousel renders on mobile
- **WHEN** the viewport is < 960px
- **THEN** a "Resources" section appears below the box grid with horizontally scrollable resource cards and bullet-dot pagination

#### Scenario: News carousel renders on mobile
- **WHEN** the viewport is < 960px
- **THEN** a "News" section appears below the Resources carousel with horizontally scrollable news items (no category tag, matching SPA `hideTag={true}`)

#### Scenario: Carousels are absent from desktop
- **WHEN** the viewport is `>= 960px`
- **THEN** both carousels are `display: none` and the mobile carousel island JS is not loaded (`client:media="(max-width: 959px)"`)

#### Scenario: Regional overview link behavior on mobile
- **WHEN** a user taps the "Regional overview" card
- **THEN** the browser navigates directly to `homePageContent.analysis.regional.buttonLink` without opening the SPA's regional popup

## ADDED Requirements

### Requirement: Bubble pattern decoration preserves natural aspect ratio
The decorative bubble-pattern image inside each mobile card SHALL render at its natural aspect ratio (`width: auto`, `height: 100%`, `max-width: none`), overriding the global `img { max-width: 100% }` rule from `theme.css`. This guarantees that the dotted pattern is visible inside both the small and big boxes (rather than being squashed and clipped by `object-fit: fill`).

#### Scenario: Bubble image preserves aspect ratio in big boxes
- **WHEN** a big box (`Indicator explorer` or `Policy explorer`) renders at 390px viewport
- **THEN** the bubble-pattern `<img>` has `max-width: none` and computes a width matching its native 625:227 aspect ratio at the box's height (≈ 480px wide for a 174px-tall box)

#### Scenario: Bubble image extends past the box and is cropped
- **WHEN** the bubble-pattern image is wider than its container
- **THEN** the parent has `overflow: hidden` so only the visible portion paints, matching the SPA's appearance

### Requirement: Mobile box heights match SPA within 2px
Small boxes (Regional overview, Countries & areas, Methods, Resources) SHALL render at a height within ±2px of the SPA's 58px at 390px viewport. Big boxes (Indicator explorer, Policy explorer) SHALL render at a height within ±2px of the SPA's 188px at 390px viewport.

#### Scenario: Small box at 390px viewport
- **WHEN** a small box renders at 390px viewport
- **THEN** its outer height is between 56px and 60px

#### Scenario: Big box at 390px viewport
- **WHEN** a big box renders at 390px viewport
- **THEN** its outer height is between 186px and 190px

### Requirement: Mobile map hero overlays static copy and YouTube iframe
A static `MobileMapHero.astro` component SHALL overlay the mobile `.map-section` with the SPA's mobile panel content: the `mainMapPanel` description (rendered from markdown) and the YouTube `<iframe>` from `content.videoLink`. The overlay SHALL match the SPA's visual treatment:

- Background color `#0089d6` at `opacity: 0.9`, `position: absolute; inset: 0`.
- Outer padding `24px`, inner wrapper padding `16px` (total 40px from the edge).
- Typography: `font-family: Lato, Roboto, Helvetica, Arial, sans-serif`, `font-size: 16px`, `font-weight: 400`, `line-height: 24px`, `color: white`, no `text-shadow`.
- Description paragraphs: `margin: 0 0 16px`.
- Video wrapper: `position: relative`, `width: 100%`, `max-width: 70ch`, `margin: 40px 0`, `aspect-ratio: 16 / 9`, `overflow: hidden`.
- Iframe: no `loading` attribute (matches SPA), `allowfullscreen`, `referrerpolicy="strict-origin-when-cross-origin"`, absolute-positioned to fill the wrapper.

The component SHALL be rendered inside a `.mobile-only` wrapper in `index.astro` whose scoped CSS hides it at `>= 960px` (`display: none`). The component itself does not carry the media query, so the wrapper is the single source of truth for the mobile-only breakpoint.

#### Scenario: Mobile hero computed styles match SPA
- **WHEN** the hero renders at viewport < 960px
- **THEN** a paragraph inside `.mobile-map-hero .description` computes `font-family` starting with `Lato`, `font-size: 16px`, `line-height: 24px`, `margin: 0px 0px 16px`, and `text-shadow: none`

#### Scenario: Mobile hero background overlay
- **WHEN** the hero renders at viewport < 960px
- **THEN** `.mobile-map-hero` computes `background-color: rgb(0, 137, 214)` and `opacity: 0.9`, overlaying the static map image underneath

### Requirement: Mobile carousel uses CSS scroll-snap with bullet pagination
The mobile carousel island SHALL use a horizontally scrolling track with `scroll-snap-type: x mandatory` and `scroll-snap-align: center` per slide. Bullet dots below the track SHALL reflect and control the active slide. Native scrollbars SHALL be hidden. The island SHALL ship without third-party carousel dependencies.

#### Scenario: Touch swipe scrolls the track
- **WHEN** the user swipes horizontally on the carousel
- **THEN** the track scrolls and snaps to the nearest slide

#### Scenario: Dot click jumps to the slide
- **WHEN** the user taps a bullet dot
- **THEN** the track smoothly scrolls so the corresponding slide is centered, and that dot becomes the active dot

#### Scenario: Active dot tracks scroll position
- **WHEN** the track scrolls past the midpoint of a slide
- **THEN** the active dot updates to that slide's index
