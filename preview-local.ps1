param(
    [int]$Port = 8000
)

$ErrorActionPreference = 'Stop'

$siteRoot = Join-Path $PSScriptRoot 'prototype'

if (-not (Test-Path $siteRoot)) {
    throw "Site root not found: $siteRoot"
}

Set-Location $siteRoot
Write-Host "Serving local preview from $siteRoot on http://127.0.0.1:$Port/" -ForegroundColor Cyan
python -m http.server $Port