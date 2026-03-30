param(
  [Parameter(Mandatory = $true)]
  [string]$Url,

  [string]$Salida = "qr-sorpresa.png"
)

if (-not ($Url -match '^https?://')) {
  Write-Error "La URL debe iniciar con http:// o https://"
  exit 1
}

$encoded = [System.Uri]::EscapeDataString($Url)
$qrApi = "https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=$encoded"

Invoke-WebRequest -Uri $qrApi -OutFile $Salida
Write-Host "QR generado en: $Salida"
