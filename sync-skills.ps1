# Copies .agents/skills (Codex, Antigravity) into .claude/skills (Claude Code).
# Edit skills in .agents/skills, then run: powershell -ExecutionPolicy Bypass -File sync-skills.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (Test-Path '.claude/skills') { Remove-Item '.claude/skills' -Recurse -Force }
New-Item -ItemType Directory -Force '.claude' | Out-Null
Copy-Item '.agents/skills' '.claude/skills' -Recurse
Write-Output 'Synced .agents/skills -> .claude/skills'
