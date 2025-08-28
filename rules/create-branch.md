# Create Branch Workflow

This document outlines the standard workflow for creating new branches in the repository.

## Workflow Steps

### 1. Determine Base Branch
Ask the user to specify the base branch:
- **Main branch**: Switch to main branch as the base
- **Current branch**: Use the current branch as the base

### 2. Switch to Base Branch (if needed)
If the base branch is main:
```bash
git checkout main
git pull origin main  # Ensure latest changes
```

### 3. Generate Branch Name
- **If git stage has changes**: Create branch name based on the staged file changes
- **If git stage is empty**: Ask the user to provide a branch name

### 4. Create Child Branch
Create and switch to the new branch:
```bash
git checkout -b <branch-name>
```

## Branch Naming Conventions

### Auto-generated Names (based on file changes)
- `feature/user-auth` (if auth-related files are modified)
- `fix/login-validation` (if fixing validation issues)
- `update/dependencies` (if package files are modified)
- `docs/readme-updates` (if documentation files are changed)

### Manual Names (when stage is empty)
Follow these patterns:
- `feature/<description>` - For new features
- `fix/<description>` - For bug fixes
- `update/<description>` - For updates/improvements
- `docs/<description>` - For documentation changes
- `refactor/<description>` - For code refactoring

## Decision Flow

```
1. Ask: "Base branch - main or current?"
   ├── Main → Switch to main branch
   └── Current → Stay on current branch

2. Check git stage status
   ├── Has changes → Generate name from file changes
   └── Empty → Ask user for branch name

3. Create and switch to new branch
```

## Examples

### Example 1: Using main as base with staged changes
```bash
# User chooses main as base
git checkout main
git pull origin main

# Staged files: src/auth/login.js, src/auth/register.js
# Auto-generated name: feature/auth-system
git checkout -b feature/auth-system
```

### Example 2: Using current branch with empty stage
```bash
# User chooses current branch as base
# No staged changes
# User provides name: "fix/navbar-responsive"
git checkout -b fix/navbar-responsive
```

### Example 3: Using current branch with staged changes
```bash
# User chooses current branch as base
# Staged files: docs/README.md, docs/CONTRIBUTING.md
# Auto-generated name: docs/readme-contributing
git checkout -b docs/readme-contributing
```

## Validation Steps

Before creating the branch:
1. Verify the base branch exists
2. Check if the proposed branch name already exists
3. Ensure the working directory is clean (if switching to main)
4. Confirm the branch name follows naming conventions
