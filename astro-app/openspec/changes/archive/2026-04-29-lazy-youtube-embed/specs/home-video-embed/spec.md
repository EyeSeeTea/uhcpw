## ADDED Requirements

### Requirement: Desktop home page MUST NOT load any YouTube resources

When a viewport wider than the mobile breakpoint (≥ 960px) loads the home page, the page SHALL NOT issue any network requests to `youtube.com`, `youtu.be`, `youtube-nocookie.com`, or `ytimg.com`, and SHALL NOT instantiate any YouTube-related custom element or iframe in the live DOM.

#### Scenario: Desktop visitor on the home page
- **WHEN** the home page is loaded with a viewport width of 1280px
- **THEN** the network log contains zero requests to any YouTube-owned host
- **AND** `document.querySelector("lite-youtube, iframe[src*='youtube']")` returns `null`

#### Scenario: Mobile visitor on the home page
- **WHEN** the home page is loaded with a viewport width of 375px and `mainMapPanel.videoLink` is set
- **THEN** the live DOM contains a `<lite-youtube>` element bound to that video
- **AND** no `<iframe>` for the YouTube player exists yet (it appears only after user interaction)

### Requirement: Mobile YouTube embed MUST defer the real player until user interaction

On viewports at the mobile breakpoint or below (≤ 959px), the home page SHALL render a lightweight YouTube facade (poster + play button) for `mainMapPanel.videoLink`. The full YouTube `<iframe>` SHALL only be created after the user activates the play control.

#### Scenario: Mobile user has not played the video
- **WHEN** the mobile home page finishes initial load
- **THEN** no `<iframe>` element exists for the YouTube player
- **AND** the only YouTube-origin resource fetched is the poster thumbnail (e.g. `i.ytimg.com/...`)

#### Scenario: Mobile user taps the play button
- **WHEN** the user activates the play control on the facade
- **THEN** an `<iframe>` is inserted into the DOM with the YouTube embed URL derived from `videoLink`
- **AND** playback begins (autoplay enabled by the facade)

### Requirement: `videoLink` data contract is preserved

The home page hero panel SHALL continue to consume `MainMapPanelContent.videoLink` as a single string field. No callers, content sources, or domain types change as a result of this work.

#### Scenario: `videoLink` is a full YouTube URL
- **WHEN** `mainMapPanel.videoLink` is `"https://www.youtube.com/embed/<id>"`
- **THEN** the mobile facade resolves the correct video by id and shows the matching thumbnail

#### Scenario: `videoLink` is absent
- **WHEN** `mainMapPanel.videoLink` is empty or undefined
- **THEN** the mobile hero renders the description text without any video facade
- **AND** no YouTube-origin resource is fetched on mobile or desktop
