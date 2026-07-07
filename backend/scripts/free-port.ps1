$port = 5000
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if (-not $connections) {
  Write-Host "Port $port is already free."
  exit 0
}

$processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $processIds) {
  if ($processId -and $processId -ne 0) {
    Write-Host "Stopping process $processId using port $port..."
    Stop-Process -Id $processId -Force
  }
}

Write-Host "Port $port is free now."
