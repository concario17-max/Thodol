$json = Get-Content public/data.json -Raw | ConvertFrom-Json
$item = $json | Where-Object { $_.id -eq "3.22" }
$item | ConvertTo-Json -Depth 10 | Out-File -FilePath "temp_322.json" -Encoding UTF8
