$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$artRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../assets/detective'))
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]86)
try {
 foreach ($artId in @('race','duck','pigs','redhood','beans','ant','lion','fox','wind','ax','piper','troy','opening-bedroom','ending-morning')) {
  $sourcePath = Join-Path $artRoot ($artId + '.png')
  $targetPath = Join-Path $artRoot ($artId + '.jpg')
  if (!(Test-Path -LiteralPath $sourcePath)) { throw "Missing generated art: $artId" }
  $artImage = [System.Drawing.Image]::FromFile($sourcePath)
  try { $artImage.Save($targetPath, $codec, $parameters) } finally { $artImage.Dispose() }
 }
} finally { $parameters.Dispose() }
Write-Output 'Twelve complete comic sheets and two family paintings encoded as JPEG; original PNGs and panel geometry preserved.'
