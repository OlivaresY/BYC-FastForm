---
name: changelog-standards
description: Enforces automatic updates to the root CHANGELOG.md file structured under # UNRELEASED with Jira issue links categorized into Feature and Bugfix.
---

# Changelog Management Standards

This skill defines the protocol for tracking project progression and updates inside the root **`CHANGELOG.md`** file, maintaining direct traceability to Jira issues.

## 1. Mandatory Protocol for Changelog Updates

Every time a feature, bugfix, or refactor task is completed, tested, and approved, the AI agent must update the root **`CHANGELOG.md`** file before concluding the task.

### Format Structure & Categorization:
- Update or create the `# UNRELEASED` section at the top of the file.
- Categorize entries strictly under `## Feature` or `## Bugfix`.
- Append the full Jira issue URL provided during the task context.

### Example Format:
```markdown
# UNRELEASED

## Feature

- https://tec-dev-ia.atlassian.net/browse/HOM-XXX

## Bugfix

- https://tec-dev-ia.atlassian.net/browse/HOM-YYY