# Audits the tools a vibe-coding student needs on Windows (PowerShell 5.1+ or 7+).
# Read-only: it never installs or changes anything. Prints a Markdown table.
# Run:  powershell -NoProfile -ExecutionPolicy Bypass -File check_env.ps1

$ErrorActionPreference = 'SilentlyContinue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$MinNode = 20
$MinPy = [version]'3.10'

# Emoji written as code points so the file works in Windows PowerShell 5.1 (which misreads UTF-8 without BOM)
$OK   = [char]::ConvertFromUtf32(0x2705)            # check mark
$NO   = [char]::ConvertFromUtf32(0x274C)            # cross
$WARN = [char]::ConvertFromUtf32(0x26A0) + [char]0xFE0F
$OPT  = [char]::ConvertFromUtf32(0x2796)            # minus
$DASH = [char]0x2014

function Get-Ver([string]$text) {
  if ($text -match '(\d+(\.\d+)+)') { return $Matches[1] } else { return '?' }
}
function Run([string]$exe, [string[]]$argList) {
  try { return ((& $exe @argList 2>&1) | Out-String).Trim() } catch { return '' }
}
function Has([string]$cmd) { return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }

$rows = New-Object System.Collections.Generic.List[string]
function Add-Row($name, $purpose, $level, $status, $ver) {
  $rows.Add("| $name | $purpose | $level | $status | $ver |")
}
function Check($name, $purpose, $level, $exe, [string[]]$argList) {
  if (Has $exe) {
    Add-Row $name $purpose $level "$OK installed" (Get-Ver (Run $exe $argList))
  } elseif ($level -eq 'core') {
    Add-Row $name $purpose $level "$NO missing" $DASH
  } else {
    Add-Row $name $purpose $level "$OPT not installed" $DASH
  }
}

# ---------- computer info ----------
$osName = (Get-CimInstance Win32_OperatingSystem).Caption
if (-not $osName) { $osName = 'Windows' }
$arch = $env:PROCESSOR_ARCHITECTURE
$pm = 'none found'
foreach ($p in 'winget','scoop','choco') { if (Has $p) { $pm = $p; break } }

# ---------- core ----------
Check 'Git' 'saves versions of your code' 'core' 'git' @('--version')

if (Has 'node') {
  $v = Get-Ver (Run 'node' @('--version'))
  $major = 0; [int]::TryParse(($v -split '\.')[0], [ref]$major) | Out-Null
  if ($major -ge $MinNode) { Add-Row 'Node.js' 'runs websites (Next.js) and JS tools' 'core' "$OK installed" $v }
  else { Add-Row 'Node.js' 'runs websites (Next.js) and JS tools' 'core' "$WARN too old (need $MinNode+)" $v }
} else { Add-Row 'Node.js' 'runs websites (Next.js) and JS tools' 'core' "$NO missing" $DASH }

Check 'npm' 'installs JavaScript packages' 'core' 'npm' @('--version')

# Python: 'python' may be the Microsoft Store stub that prints nothing useful, so check the output.
$py = $null; $pyArgs = @()
foreach ($cand in @(@('py', @('-3')), @('python', @()), @('python3', @()))) {
  $exe = $cand[0]; $pre = $cand[1]
  if (Has $exe) {
    $out = Run $exe ($pre + @('--version'))
    if ($out -match 'Python \d') { $py = $exe; $pyArgs = $pre; break }
  }
}
if ($py) {
  $v = Get-Ver (Run $py ($pyArgs + @('--version')))
  $pv = $null; [version]::TryParse($v, [ref]$pv) | Out-Null
  if ($pv -and $pv -ge $MinPy) { Add-Row 'Python' 'runs Telegram bots (aiogram)' 'core' "$OK installed" $v }
  else { Add-Row 'Python' 'runs Telegram bots (aiogram)' 'core' "$WARN too old (need 3.10+)" $v }
  $pip = Run $py ($pyArgs + @('-m','pip','--version'))
  if ($pip -match 'pip \d') { Add-Row 'pip' 'installs Python packages' 'core' "$OK installed" (Get-Ver $pip) }
  else { Add-Row 'pip' 'installs Python packages' 'core' "$NO missing" $DASH }
} else {
  Add-Row 'Python' 'runs Telegram bots (aiogram)' 'core' "$NO missing" $DASH
  Add-Row 'pip' 'installs Python packages' 'core' "$NO missing" $DASH
}

if (Has 'git') {
  $gn = Run 'git' @('config','--global','user.name')
  $ge = Run 'git' @('config','--global','user.email')
  if ($gn -and $ge) { Add-Row 'Git name & email' 'your name on every save (commit)' 'core' "$OK set" $gn }
  else { Add-Row 'Git name & email' 'your name on every save (commit)' 'core' "$NO not set" $DASH }
}

# ---------- AI coding tool (one is enough; Antigravity is a desktop app, not checked here) ----------
Check 'Claude Code' 'AI coding helper (one is enough)' 'ai-tool' 'claude' @('--version')
Check 'Codex CLI' 'AI coding helper (one is enough)' 'ai-tool' 'codex' @('--version')

# ---------- optional ----------
Check 'VS Code' 'code editor to see your files' 'optional' 'code' @('--version')
Check 'GitHub CLI (gh)' 'log in to GitHub from the terminal' 'optional' 'gh' @('--version')
Check 'Vercel CLI' 'deploy web apps from the terminal' 'optional' 'vercel' @('--version')
Check 'Netlify CLI' 'deploy static sites from the terminal' 'optional' 'netlify' @('--version')
Check 'Supabase CLI' 'database tools (or use: npx supabase)' 'optional' 'supabase' @('--version')
Check 'Railway CLI' 'deploy bots from the terminal' 'optional' 'railway' @('--version')

# ---------- output ----------
Write-Output "Computer: $osName ($arch)"
Write-Output "Package manager: $pm"
Write-Output ''
Write-Output '| Tool | Needed for | Level | Status | Version |'
Write-Output '|---|---|---|---|---|'
$rows | ForEach-Object { Write-Output $_ }
