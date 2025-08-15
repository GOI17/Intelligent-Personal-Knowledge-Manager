# Pull Request Template

This document provides a template for creating pull requests in the Intelligent Personal Knowledge Manager repository.

## Creating Pull Requests

**REQUIREMENT**: All pull requests must be created using GitHub CLI (`gh`) for consistency and automation.

### GitHub CLI Command Format
```bash
gh pr create --base [TARGET_BRANCH] --head [FEATURE_BRANCH] --title "[PR_TITLE]" --body "[PR_DESCRIPTION]"
```

### Example Command
```bash
gh pr create --base develop --head feature/example-feature --title "Feature: Add new functionality" --body "$(cat pr-description.md)"
```

## Pull Request Template

### Title Format
```
[Phase/Type]: [Brief description of changes]
```

**Examples:**
- `Phase 1 Complete: Project Foundation with Full CRUD Operations`
- `Feature: Add user authentication system`
- `Fix: Resolve note deletion bug`
- `Enhancement: Improve search performance`

### Description Template

```markdown
## 🎯 [Phase/Feature] Implementation

Brief description of what this PR accomplishes and its relation to project phases.

## ✅ What's Included

### 🏗️ **[Category 1]** (e.g., Infrastructure, Features, etc.)
- **Feature 1**: Description of implementation
- **Feature 2**: Technical details and benefits
- **Feature 3**: Integration details

### 🎨 **[Category 2]** (e.g., UI Components, Backend, etc.)
- **Component/Feature 1**: Detailed description
- **Component/Feature 2**: Technical implementation
- **Component/Feature 3**: Usage and benefits

### 📝 **[Category 3]** (e.g., Business Logic, API, etc.)
- **Implementation 1**: What was built and why
- **Implementation 2**: Technical approach
- **Implementation 3**: Integration points

## 🧩 **Components/Files Changed**
- **Component 1**: Purpose and functionality
- **Component 2**: Technical details
- **Component 3**: Integration aspects

## 📊 **Technical Details**
- **Technology Stack**: List technologies used
- **Architecture**: Describe architectural decisions
- **Performance**: Performance considerations
- **Security**: Security measures implemented
- **Testing**: Testing approach and coverage

## 🧪 **Testing**
- ✅ **Build**: `npm run build` passes
- ✅ **TypeScript**: No compilation errors
- ✅ **Linting**: ESLint rules passing
- ✅ **Manual Testing**: Tested functionality works
- ✅ **Responsive**: Mobile/desktop compatibility
- ✅ **Accessibility**: Screen reader compatibility (if applicable)

## 📈 **Performance**
- **Bundle Size**: Impact on bundle size
- **Build Time**: Compilation performance
- **Runtime**: Performance optimizations
- **Memory**: Memory usage considerations

## 🗂️ **File Structure** (if significant changes)
```
├── [directory]/
│   ├── [subdirectory]/    # Purpose
│   └── [files]            # Functionality
├── [new-feature]/         # New additions
└── [updated-area]/        # Modified sections
```

## 🚀 **Ready for [Next Phase/Integration]**

This implementation provides:
- ✅ **Feature 1**: Ready for use
- ✅ **Feature 2**: Integrated and tested
- ✅ **Feature 3**: Documented and maintainable

**Next Steps**: Brief description of what comes next

## 📸 **Demo/Usage**
Description of how to test or use the new functionality:
- Step 1: How to access
- Step 2: How to use
- Step 3: Expected behavior

## 🔗 **Dependencies**
- **Requires**: List any dependencies
- **Blocks**: Any issues this resolves
- **Related**: Related PRs or issues

---

**Time Estimate**: Actual time vs planned
**Phase**: Current project phase
**Priority**: High/Medium/Low
```

## Pull Request Checklist

Before creating a PR, ensure:

- [ ] **Code Quality**
  - [ ] Code follows project style guidelines
  - [ ] TypeScript types are properly defined
  - [ ] No console.log or debug code left in
  - [ ] Code is properly commented where needed

- [ ] **Testing**
  - [ ] `npm run build` passes without errors
  - [ ] All TypeScript compilation passes
  - [ ] ESLint rules pass
  - [ ] Manual testing completed
  - [ ] Responsive design tested

- [ ] **Documentation**
  - [ ] README updated if needed
  - [ ] Component documentation added/updated
  - [ ] Type definitions are complete
  - [ ] API changes documented

- [ ] **Git Hygiene**
  - [ ] Branch is up to date with target branch
  - [ ] Commit messages are descriptive
  - [ ] No merge conflicts
  - [ ] PR title follows template format

## Branch Naming Convention

Follow this pattern for branch names:
- `feature/[description]` - New features
- `fix/[description]` - Bug fixes
- `enhancement/[description]` - Improvements
- `docs/[description]` - Documentation updates
- `refactor/[description]` - Code refactoring

## Target Branches

- **develop** - Main development branch for new features
- **main** - Production-ready code
- **hotfix/[name]** - Critical fixes that need immediate attention

## Example GitHub CLI Commands

### Create PR against develop (most common)
```bash
gh pr create --base develop --head feature/my-feature --title "Feature: Add new functionality" --body "Detailed description of changes"
```

### Create PR with template file
```bash
gh pr create --base develop --head feature/my-feature --title "Feature: Add new functionality" --body-file pr-description.md
```

### Create PR with interactive mode
```bash
gh pr create
# Follow the interactive prompts
```

## Review Process

1. **Create PR** using GitHub CLI
2. **Assign reviewers** (if required)
3. **Address feedback** from code review
4. **Update PR** with requested changes
5. **Merge** after approval (following merge strategy)

## Notes

- Always use GitHub CLI (`gh`) for creating pull requests
- Include all relevant sections from the template
- Be detailed in descriptions to help reviewers
- Update the PR if requirements change during development
- Link related issues or dependencies where applicable
