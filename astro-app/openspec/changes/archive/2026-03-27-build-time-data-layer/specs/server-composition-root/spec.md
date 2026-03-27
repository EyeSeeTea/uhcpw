## ADDED Requirements

### Requirement: Server-side composition root singleton
The system SHALL provide a `getServerCompositionRoot()` function in `astro-app/src/lib/composition-root.server.ts` that returns a `CompositionRoot` instance configured for server-side (build-time) use.

#### Scenario: Successful instantiation with valid env vars
- **WHEN** `DHIS2_BASE_URL`, `DHIS2_USERNAME`, and `DHIS2_PASSWORD` are set in the environment
- **THEN** `getServerCompositionRoot()` SHALL return a `CompositionRoot` instance using a `D2Api` configured with those credentials

#### Scenario: Singleton behavior across multiple calls
- **WHEN** `getServerCompositionRoot()` is called multiple times within the same build process
- **THEN** it SHALL return the same `CompositionRoot` instance (not create a new `D2Api` each time)

#### Scenario: Missing environment variables
- **WHEN** any of `DHIS2_BASE_URL`, `DHIS2_USERNAME`, or `DHIS2_PASSWORD` is missing
- **THEN** the function SHALL throw a descriptive error identifying the missing variable(s)

### Requirement: Environment variable documentation
The system SHALL include an `.env.example` file in `astro-app/` documenting all required DHIS2 environment variables.

#### Scenario: .env.example exists with all required vars
- **WHEN** a developer clones the repository
- **THEN** `astro-app/.env.example` SHALL contain `DHIS2_BASE_URL`, `DHIS2_USERNAME`, and `DHIS2_PASSWORD` with placeholder values and descriptions
