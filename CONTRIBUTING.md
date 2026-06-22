# Contributing

The Agentic Network Platform is built through an issue-driven workflow. Every code change should have a public issue, a linked pull request, review evidence, and a merge trail.

This applies even when the implementation is written by an AI coding agent.

## Core Rule

No code change should go directly to `main` after the repository is published.

Every code change should follow this path:

```text
prompt or proposal -> GitHub issue -> implementation branch -> pull request -> checks -> human review -> merge -> issue close
```

Documentation-only edits may use a lighter checklist, but they should still use an issue and pull request once the project is public.

## Roles

- Requester: opens or prompts creation of the issue and defines the outcome.
- AI implementer: writes code, tests, docs, and PR evidence.
- Human maintainer: reviews, approves, rejects, or requests changes.
- Automation: runs tests, linting, security scans, policy checks, and release checks.

The AI implementer may propose and apply changes, but it should not be the only approval signal for merging into `main`.

## Required Issue Content

Each implementation issue should include:

- Problem statement.
- Desired outcome.
- Scope and non-goals.
- Security, identity, or policy impact.
- Acceptance criteria.
- Test and validation expectations.
- Documentation impact.

## Required PR Content

Each pull request should include:

- Linked issue using `Closes #123`, `Fixes #123`, or `Resolves #123`.
- Summary of changes.
- Security and trust impact.
- Test evidence.
- Documentation updates.
- Reviewer checklist.

## Branch Naming

Use predictable branch names:

```text
issue-<number>/<short-slug>
```

Examples:

```text
issue-12/nornir-driver-policy
issue-18/delegated-identity-envelope
issue-21/episodic-memory-schema
```

## Review Expectations

Before merge, the reviewer should confirm:

- The PR links to a real issue.
- The implementation matches the issue acceptance criteria.
- Tests or validation evidence are present.
- Security and identity implications are stated.
- Documentation is updated when behavior changes.
- The PR does not contain unrelated changes.

## AI-Assisted Development

AI assistance is allowed and expected. The project should be transparent about it.

When an AI agent writes or materially edits a PR, the PR should include:

- `AI-assisted: yes`
- The agent or tool used when practical.
- A short note describing what the AI changed.
- Human review before merge.

This keeps the project honest: one person may direct the work and an AI may write the code, but the public trail still shows intent, review, validation, and accountability.
