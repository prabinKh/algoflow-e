# Git Commands Used for Initial Setup

Here are the commands used to initialize the local repository, sync with the remote repository on GitHub, resolve merge conflicts, and push the code:

1. **Initialize the repository and commit local code:**
   ```bash
   git init
   git add .
   git commit -m "Add Interactive 360 Product Showcase"
   git branch -M main
   git remote add origin https://github.com/prabinKh/algoflow-e.git
   ```

2. **Fetch and merge the existing commits from the GitHub repository:**
   ```bash
   git fetch origin main
   git merge origin/main --allow-unrelated-histories -m "Merge remote main"
   ```

3. **Resolve the README.md conflict by keeping the local version:**
   ```bash
   git checkout --ours README.md
   git add README.md
   git commit -m "Resolve merge conflict with remote repository"
   ```

4. **Push the combined code back to GitHub:**
   ```bash
   git push -u origin main
   ```
