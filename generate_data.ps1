# encoding set to UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$sutras = [ordered]@{}

# Function to ensure nested object exists
function Get-OrCreateSutra {
    param ($id)
    if (-not $sutras.Contains($id)) {
        $sutras[$id] = [ordered]@{ id = $id }
    }
    return $sutras[$id]
}

# Generic Function to Process Block Format Files (ID on one line, Text on next)
function Process-BlockFile {
    param ($filePath, $keyName)
    
    if (-not (Test-Path $filePath)) { return }

    Write-Host "Processing $filePath to key '$keyName'..."
    $lines = Get-Content $filePath -Encoding UTF8
    $currentId = $null
    
    foreach ($line in $lines) {
        if ($line -eq $null) { continue }
        $line = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($line)) { continue }

        # Check for ID (e.g., 1-1, 1-51) at start of line
        if ($line -match "^(\d+)-(\d+)(.*)$") {
            $currentId = "$($Matches[1]).$($Matches[2])"
            $line = $Matches[3].Trim()
            if ([string]::IsNullOrWhiteSpace($line)) {
                continue
            }
            # If there's content on the ID line, fall through to process it
        }

        # If we have an ID and this line is not an ID, it's content
        if ($currentId -ne $null) {
            # Cleanup prefixes for specific files as requested
            # Using Unicode chars to avoid script encoding issues
            # '직' = 0xC9C1, '역' = 0xC5ED, '의' = 0xC758
            $jik = "$([char]0xC9C1)$([char]0xC5ED)"
            $uu = "$([char]0xC758)$([char]0xC5ED)"

            if ($keyName -eq "5.bae_jik") {
                if ($line -match "^$jik\s*(.*)") {
                    $line = $Matches[1]
                }
            }
            elseif ($keyName -eq "6.bae_uu") {
                if ($line -match "^$uu\s*(.*)") {
                    $line = $Matches[1]
                }
            }

            $sutra = Get-OrCreateSutra $currentId
            if ($sutra.Contains($keyName) -and -not [string]::IsNullOrEmpty($sutra[$keyName])) {
                $sutra[$keyName] += " $line"
            }
            else {
                $sutra[$keyName] = $line
            }
        }
    }
}

# 1. Process 1.sans.txt (Special Dual-Block Format)
# 1.sans.txt has separate Sanskrit and Pronunciation lines
Write-Host "Processing 1.sans.txt..."
$lines = Get-Content "1.sans.txt" -Encoding UTF8
$currentId = $null
$state = 0 # 0: Look for ID, 1: Sanskrit, 2: Pronunciation

foreach ($line in $lines) {
    if ($line -eq $null) { continue }
    $line = $line.Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { continue }

    if ($line -match "^(\d+)-(\d+)$") {
        $currentId = "$($Matches[1]).$($Matches[2])"
        $currentSutra = Get-OrCreateSutra $currentId
        $state = 1
        continue
    }

    if ($currentId -ne $null) {
        if ($state -eq 1) {
            $currentSutra["sanskrit"] = $line
            $state = 2
        }
        elseif ($state -eq 2) {
            $currentSutra["pronunciation"] = $line
            $state = 0
        }
    }
}

# 2. Process Line Format Files (e.g. 2.english.txt, 3.korean-1.txt)
# We explicitly list them or exclude the known block files
$files = Get-ChildItem *.txt | Where-Object { 
    $_.Name -ne "1.sans.txt" -and 
    $_.Name -ne "4.han bal.txt" -and 
    $_.Name -ne "5.bae_jik.txt" -and 
    $_.Name -ne "6.bae_uu.txt" 
}

foreach ($file in $files) {
    Write-Host "Processing Line Format: $($file.Name)..."
    $keyName = $file.BaseName
    
    $contentLines = Get-Content $file.FullName -Encoding UTF8
    foreach ($textLine in $contentLines) {
        if ($textLine -eq $null) { continue }
        $textLine = $textLine.Trim()
        # Match "1-1. Text" or "1-1 Text"
        if ($textLine -match "^(\d+)-(\d+)[\.\s]*(.*)$") {
            $id = "$($Matches[1]).$($Matches[2])"
            $text = $Matches[3].Trim()
            
            $sutra = Get-OrCreateSutra $id
            $sutra[$keyName] = $text
        }
    }
}

# 3. Process Specific Block Format Files
Process-BlockFile "4.han bal.txt" "pronunciation_kr"
Process-BlockFile "5.bae_jik.txt" "5.bae_jik"
Process-BlockFile "6.bae_uu.txt" "6.bae_uu"



# 4. Process Word Meanings (7.dan.txt) with Sequential Mapping
Write-Host "Processing 7.dan.txt for word meanings (Sequential Mapping)..."

# First, we need to re-parse 1.sans.txt to get the ordered list of words for each Sutra
$sansWordsMap = [ordered]@{}
$lines = Get-Content "1.sans.txt" -Encoding UTF8
$currentId = $null
$state = 0
foreach ($line in $lines) {
    if ($line -eq $null) { continue }
    $line = $line.Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { continue }

    if ($line -match "^(\d+)-(\d+)$") {
        $currentId = "$($Matches[1]).$($Matches[2])"
        $state = 1
        continue
    }

    if ($currentId -ne $null) {
        if ($state -eq 1) {
            # Sanskrit line (ignore for word list)
            $state = 2
        }
        elseif ($state -eq 2) {
            # Pronunciation line - extract words
            if (-not [string]::IsNullOrWhiteSpace($line)) {
                # Remove symbols like |, ||, ., , and trim
                $cleanLine = $line -replace '\|\|', '' -replace '\|', '' -replace '\.', '' -replace ',', ''
                # Split by whitespace OR hyphen to handle compound words
                $sansWordsMap[$currentId] = $cleanLine.Split(" -", [System.StringSplitOptions]::RemoveEmptyEntries)
            }
            $state = 0
        }
    }
}

# Now process 7.dan.txt and map sequentially
if (Test-Path "7.dan.txt") {
    $lines = Get-Content "7.dan.txt" -Encoding UTF8
    $currentId = $null
    $definitionIndex = 0
    
    foreach ($line in $lines) {
        if ($line -eq $null) { continue }
        $line = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($line)) { continue }

        # Check for ID (e.g., 1-1)
        if ($line -match "^(\d+)-(\d+)$") {
            $currentId = "$($Matches[1]).$($Matches[2])"
            $definitionIndex = 0 
            continue
        }

        # If we have an ID, parse word definitions
        if ($currentId -ne $null) {
            # Format: "word definition..."
            # We assume the order matches 1.sans.txt words
            
            $parts = $line -split ' ', 2
            if ($parts.Length -eq 2) {
                # $ocrKey = $parts[0] # The key in 7.dan.txt (might be typo like 'aiha')
                $meaning = $parts[1]
                if (-not $sutra.Contains("word_meanings")) {
                    $sutra["word_meanings"] = [ordered]@{}
                }

                # Get the correct Sanskrit word from our map
                if ($sansWordsMap.Contains($currentId)) {
                    $wordList = $sansWordsMap[$currentId]
                    
                    if ($definitionIndex -lt $wordList.Count) {
                        $correctKey = $wordList[$definitionIndex]
                        
                        # Normalize key for consistency (remove diacritics for JS key matching if needed, 
                        # but User wants correct 'atha' -> 'aiha' mapping. 
                        # The JS likely normalizes input 'atha' to look up 'atha'.
                        # So we should save the key as 'atha' (from 1.sans.txt)
                        # We do minimal normalization here to match JS logic if it strips dots etc?
                        # Actually 1.sans.txt has 'anuśāsanam', we want to save key 'anuśāsanam' 
                        # OR valid IAST.
                        # Let's clean the key slightly (lowercase, trim)
                        $cleanKey = $correctKey.ToLower().Trim(".,")
                        
                        $sutra["word_meanings"][$cleanKey] = $meaning
                    }
                    else {
                        # Fallback if indices don't match (extra definition?)
                        # Use the key from file
                        $sutra["word_meanings"][$parts[0]] = $meaning
                        Write-Warning "Sutra ${currentId}: Extra definition found at index $definitionIndex. Using OCR key '$($parts[0])'."
                    }
                }
                else {
                    # Fallback if no word list found
                    $sutra["word_meanings"][$parts[0]] = $meaning
                }
                
                $definitionIndex++
            }
        }
    }
}

# 5. Sort and Save
$sortedIds = $sutras.Keys | Sort-Object { 
    $parts = $_.Split('.')
    [int]$parts[0] * 1000 + [int]$parts[1] 
}

$outputList = @()
foreach ($id in $sortedIds) {
    $outputList += $sutras[$id]
}

# Integrity Check
if ($outputList.Count -ne 196) {
    Write-Warning "Inconsistent Sutra Count: Found $($outputList.Count), Expected 196. Please Check 1.sans.txt or parsing logic."
}

$json = $outputList | ConvertTo-Json -Depth 4 -Compress
$jsContent = "const sutras = $json;"

# Output to both data.js and public/data.json
[System.IO.File]::WriteAllText("$PWD\data.js", $jsContent, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("$PWD\public\data.json", $json, [System.Text.Encoding]::UTF8)

Write-Host "Successfully generated data.js and public/data.json with $( $outputList.Count ) sutras."
