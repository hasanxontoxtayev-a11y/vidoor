# Read-only: reports the computer, the AI tool this is running in, and the kit's progress (Windows).
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File detect.ps1 [project-folder]
param([string]$Dir = '.')
$ErrorActionPreference = 'SilentlyContinue'

$os = (Get-CimInstance Win32_OperatingSystem).Caption
if (-not $os) { $os = 'Windows' }

$tool = 'unknown'; $how = 'no known environment variable found'
if ($env:ANTIGRAVITY_AGENT -or $env:ANTIGRAVITY_CLI_ALIAS) { $tool = 'Antigravity'; $how = 'ANTIGRAVITY_* variable' }
elseif ($env:CODEX_SANDBOX -or $env:CODEX_THREAD_ID -or $env:CODEX_CI -or $env:CODEX_SANDBOX_NETWORK_DISABLED) { $tool = 'Codex'; $how = 'CODEX_* variable' }
elseif ($env:CLAUDECODE -or $env:CLAUDE_CODE) { $tool = 'Claude Code'; $how = 'CLAUDECODE variable' }
elseif ($env:GEMINI_CLI) { $tool = 'Gemini CLI'; $how = 'GEMINI_CLI variable' }
elseif ($env:CURSOR_AGENT) { $tool = 'Cursor'; $how = 'CURSOR_AGENT variable' }
elseif ($env:AI_AGENT) { $tool = $env:AI_AGENT; $how = 'AI_AGENT variable' }

function Has([string]$f) { if (Test-Path (Join-Path $Dir $f)) { 'yes' } else { 'no' } }

$done = 0; $total = 0
$plan = Join-Path $Dir 'PLAN.md'
if (Test-Path $plan) {
  $lines = Get-Content $plan
  $done = @($lines | Where-Object { $_ -match '^\s*- \[[xX]\]' }).Count
  $total = @($lines | Where-Object { $_ -match '^\s*- \[[ xX]\]' }).Count
}

Write-Output "computer: $os ($env:PROCESSOR_ARCHITECTURE)"
Write-Output "ai_tool: $tool ($how)"
Write-Output "profile (.vibe/profile.md): $(Has '.vibe/profile.md')"
Write-Output "TZ-draft.md: $(Has 'TZ-draft.md')"
Write-Output "TZ.md: $(Has 'TZ.md')"
Write-Output "PLAN.md: $(Has 'PLAN.md') - tasks done: $done / $total"
Write-Output "git repository: $(if (Test-Path (Join-Path $Dir '.git')) { 'yes' } else { 'no' })"
