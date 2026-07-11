$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host "==> Building for Gitee Pages..."
pnpm run build:gitee

Write-Host "==> Preparing SPA fallback..."
Copy-Item -Force "$RepoRoot\dist\index.html" "$RepoRoot\dist\404.html"

$DeployDir = Join-Path $env:TEMP "mumu_xyzw-gitee-pages"
if (Test-Path $DeployDir) {
  Remove-Item -Recurse -Force $DeployDir
}

Write-Host "==> Staging dist to $DeployDir"
Copy-Item -Recurse "$RepoRoot\dist" $DeployDir

Set-Location $DeployDir
git init | Out-Null
git config user.email "17316448+ye-jiabao2026@user.noreply.gitee.com"
git config user.name "ye-jiabao2026"
git checkout -b gitee-pages | Out-Null
git add .
if (-not (git commit -m "deploy: gitee pages")) {
  throw "Git commit failed. Check git config and dist output."
}

$GiteeRemote = "https://gitee.com/ye-jiabao2026/mumu_xyzw.git"
Write-Host "==> Pushing to $GiteeRemote (branch: gitee-pages)"
git remote add origin $GiteeRemote 2>$null
git push -f origin gitee-pages
if ($LASTEXITCODE -ne 0) {
  throw "Git push failed. Use your Gitee password or personal access token when prompted."
}

Write-Host ""
Write-Host "Done. Open Gitee repo -> Services -> Gitee Pages"
Write-Host "Branch: gitee-pages  Directory: /"
Write-Host "Site URL: https://ye-jiabao2026.gitee.io/mumu_xyzw/"
