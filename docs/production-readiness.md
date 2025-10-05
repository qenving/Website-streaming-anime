# Production Readiness Checklist

This document summarizes the remaining gaps before the NeonWave streaming frontend/backend bundle can be deployed for real-world use.

## Streaming Pipeline
- The `Player` component now accepts multiple direct media sources (MP4/WebM/MKV/HLS) and exposes them through the HTML `<video>` element, but iframe-based embeds (for providers such as Doodstream/MixDrop) and DRM integrations are still absent.
- Seeded anime entries ship with placeholder multi-format URLs (sourced from public demo clips). Replace them with licensed assets or signed URLs before releasing to production.

## Catalog Data
- The SQLite seed combines hand-authored anime plus a thin wrapper over AniDB recommendations. It does not persist official licensing metadata, nor does it ensure that every seeded title has a valid streaming source.
- There is no automated sync job to keep the catalog in sync with an upstream provider. All data must be refreshed manually by rerunning the seed script.

## Account & Payments
- Authentication defaults to demo credentials stored in the seed script. No integration with production identity providers (OAuth, password reset, etc.) exists.
- Premium plan definitions are hard-coded via seeds. There is no checkout flow or payment provider hookup.

## Infrastructure & Ops
- The API helpers reference local placeholder endpoints. You must still provision hosting, CDN, observability, secret management, and CI/CD pipelines.
- Automated test coverage is minimal, and the lint job currently fails because of unresolved warnings in legacy files.

## Recommendation
Treat the repository as a polished prototype. Before go-live, implement a production streaming backend (including third-party embeds if desired), replace seeded media with licensed assets, wire authentication/payment providers, and harden operations (logging, monitoring, security).
