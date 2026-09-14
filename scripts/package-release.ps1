$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$gameRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$version = (Get-Content -LiteralPath (Join-Path $gameRoot 'package.json') -Raw | ConvertFrom-Json).version
$releaseVersion = ($version.Split('.')[0..1] -join '.')
$playZip = Join-Path (Split-Path $gameRoot -Parent) "storybook-dream-v$releaseVersion-play.zip"
Compress-Archive -LiteralPath (Join-Path $gameRoot 'index.html'), (Join-Path $gameRoot '시작하기.txt') -DestinationPath $playZip -Force
$sourceZip = Join-Path (Split-Path $gameRoot -Parent) 'storybook-dream-family.zip'
$sourceStream = [System.IO.File]::Open($sourceZip, [System.IO.FileMode]::Create)
$sourceArchive = [System.IO.Compression.ZipArchive]::new($sourceStream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
 $sourceFiles = @(Get-ChildItem -LiteralPath $gameRoot -File)
 foreach ($subFolder in @('src','tests','docs','scripts','assets/detective','output')) { $sourceFiles += Get-ChildItem -LiteralPath (Join-Path $gameRoot $subFolder) -File -Recurse }
 foreach ($sourceFile in $sourceFiles) {
  $entryName = 'storybook-dream/' + $sourceFile.FullName.Substring($gameRoot.Length + 1).Replace('\','/')
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($sourceArchive,$sourceFile.FullName,$entryName,[System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
 }
} finally { $sourceArchive.Dispose(); $sourceStream.Dispose() }
foreach ($archivePath in @($playZip,$sourceZip)) {
 $checkArchive = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
 try {
  $indexEntry = $checkArchive.Entries | Where-Object { $_.FullName -eq 'index.html' -or $_.FullName -eq 'storybook-dream/index.html' }
  if (!$indexEntry) { throw 'Packaged index missing' }
  $entryStream = $indexEntry.Open()
  $memoryStream = [System.IO.MemoryStream]::new()
  try { $entryStream.CopyTo($memoryStream); $packedBytes = $memoryStream.ToArray() } finally { $entryStream.Dispose(); $memoryStream.Dispose() }
  $digest = [System.Security.Cryptography.SHA256]::Create()
  try {
   $packedHash = [BitConverter]::ToString($digest.ComputeHash($packedBytes))
   $diskHash = [BitConverter]::ToString($digest.ComputeHash([System.IO.File]::ReadAllBytes((Join-Path $gameRoot 'index.html'))))
   if ($packedHash -ne $diskHash) { throw 'Packaged index differs from verified build' }
  } finally { $digest.Dispose() }
  [pscustomobject]@{Archive=(Split-Path $archivePath -Leaf);Bytes=(Get-Item -LiteralPath $archivePath).Length;Entries=$checkArchive.Entries.Count;IndexMatches=$true}
 } finally { $checkArchive.Dispose() }
}
