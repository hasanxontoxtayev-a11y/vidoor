#!/usr/bin/env bash
# Copies .agents/skills (Codex, Antigravity) into .claude/skills (Claude Code).
# Edit skills in .agents/skills, then run: bash sync-skills.sh
set -e
cd "$(dirname "$0")"
rm -rf .claude/skills
mkdir -p .claude
cp -R .agents/skills .claude/skills
echo "Synced .agents/skills -> .claude/skills"
