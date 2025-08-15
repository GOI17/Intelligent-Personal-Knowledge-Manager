# Commit Feature Workflow

This document outlines the standard workflow for committing and pushing feature changes to the GitHub repository.

## Workflow Steps

### 1. Stage Changes
- Add all changes to the staging area
- Review changes before committing

### 2. Create Commit
- **Format**: `branch-name: short description of the changes`
- **Description**: Include a detailed description of all changes in the commit body
- Ensure the commit message is clear and descriptive

### 3. Push to GitHub Repository
- Push the branch to the remote GitHub repository
- Ensure all changes are properly synchronized

## Troubleshooting

### Permission Denied Error
If you encounter a "permission denied" error when pushing:

1. Add the SSH key to the SSH store:
   ```bash
   ssh-add ~/.ssh/github_personal
   ```
2. Verify the key is loaded:
   ```bash
   ssh-add -l
   ```
3. Test the connection:
   ```bash
   ssh -T git@github.com
   ```

## Example

```bash
# Stage changes
git add .

# Create commit with proper format
git commit -m "feature/user-auth: implement user authentication system

- Added login and registration endpoints
- Implemented JWT token validation
- Created user session management
- Added password hashing with bcrypt
- Updated database schema for user table"

# Push to remote repository
git push origin feature/user-auth
```
