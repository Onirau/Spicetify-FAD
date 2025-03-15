#region Variables
$spicetifyFolderPath = "$env:LOCALAPPDATA\spicetify"
$extensionsFolderPath = "$spicetifyFolderPath\Extensions"
$fileUrl = "https://raw.githubusercontent.com/Onirau/Spicetify-FAD/refs/heads/main/wrapperFullscreen.js"
$outputFilePath = "$extensionsFolderPath\wrapperFullscreen.js"
#endregion Variables

# Function to install or repair the extension
function InstallOrRepair {
    # Check if spicetify is available as a command
    if (Get-Command spicetify -ErrorAction SilentlyContinue) {
        Write-Host "Spicetify command found."

        # Check if the Spicetify Extensions folder exists
        if (Test-Path -Path $extensionsFolderPath) {
            # Remove the existing wrapperFullscreen.js if it exists
            if (Test-Path -Path $outputFilePath) {
                Remove-Item -Path $outputFilePath -Force
                Write-Host "Existing wrapperFullscreen.js has been removed."
            }

            # Download the wrapperFullscreen.js file to the Extensions folder
            Invoke-WebRequest -Uri $fileUrl -OutFile $outputFilePath
            Write-Host "wrapperFullscreen.js has been installed to the Extensions folder."

            # Run the Spicetify config command to add the extension
            spicetify config extensions wrapperFullscreen.js
            Write-Host "Spicetify config has been updated."

            # Apply the Spicetify configuration changes
            spicetify apply
            Write-Host "Spicetify has been applied successfully."
        } else {
            Write-Host "The Extensions folder does not exist. Please check your Spicetify setup."
        }
    } else {
        Write-Host "Spicetify command not found. Please ensure Spicetify is installed and available in your PATH."
    }
}

# Function to uninstall the extension
function Uninstall {
    # Check if spicetify is available as a command
    if (Get-Command spicetify -ErrorAction SilentlyContinue) {
        Write-Host "Spicetify command found."

        # Check if the Spicetify Extensions folder exists
        if (Test-Path -Path $extensionsFolderPath) {
            # Run the Spicetify config command to remove the extension
            spicetify config extensions wrapperFullscreen.js-
            Write-Host "wrapperFullscreen.js has been removed from Spicetify config."

            # Apply the Spicetify configuration changes
            spicetify apply
            Write-Host "Spicetify has been applied successfully."
        } else {
            Write-Host "The Extensions folder does not exist. Please check your Spicetify setup."
        }
    } else {
        Write-Host "Spicetify command not found. Please ensure Spicetify is installed and available in your PATH."
    }
}

# Main menu
do {
    Clear-Host
    Write-Host "Select an option:"
    Write-Host "1. Install/Repair the wrapperFullscreen.js extension"
    Write-Host "2. Uninstall the wrapperFullscreen.js extension"
    Write-Host "3. Exit"
    $userChoice = Read-Host "Enter the number of your choice"

    switch ($userChoice) {
        1 {
            InstallOrRepair
            Read-Host "Press Enter to return to the menu"
        }
        2 {
            Uninstall
            Read-Host "Press Enter to return to the menu"
        }
        3 {
            Write-Host "Exiting... Goodbye!"
            break
        }
        default {
            Write-Host "Invalid choice, please try again."
            Read-Host "Press Enter to return to the menu"
        }
    }
} while ($userChoice -ne 3)
