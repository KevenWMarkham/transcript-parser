# Installing Transcript Parser on Windows - Windows Defender Guide

## Overview

When installing Transcript Parser on Windows, you may encounter security warnings from Windows Defender (Microsoft Defender SmartScreen). This is normal for applications that are not digitally signed with an expensive code signing certificate.

**Important**: These warnings do NOT mean the software is malicious. They appear because:

1. The application is not signed with a Microsoft-trusted certificate
2. The executable doesn't have enough "reputation" with Microsoft yet
3. Windows errs on the side of caution for new/unsigned applications

This guide will show you how to safely install Transcript Parser despite these warnings.

---

## Table of Contents

- [Understanding the Warnings](#understanding-the-warnings)
- [Installation Methods](#installation-methods)
  - [Method 1: Standard Installation (Recommended)](#method-1-standard-installation-recommended)
  - [Method 2: Portable Version](#method-2-portable-version)
- [Windows Defender SmartScreen Bypass](#windows-defender-smartscreen-bypass)
- [Antivirus Software Warnings](#antivirus-software-warnings)
- [Verifying File Integrity](#verifying-file-integrity)
- [Troubleshooting](#troubleshooting)
- [For IT Administrators](#for-it-administrators)

---

## Understanding the Warnings

### Why Does Windows Show These Warnings?

When you download and run Transcript Parser, you may see one or more of these warnings:

1. **"Windows protected your PC"** - Windows Defender SmartScreen
2. **"Unknown publisher"** - The app is not digitally signed
3. **"This file is not commonly downloaded"** - Low download count

These warnings appear because:

- **No Code Signing Certificate**: The developer has not purchased a code signing certificate ($300-500/year)
- **New Application**: The executable hasn't been downloaded enough times to build "reputation"
- **SmartScreen Protection**: Windows blocks unsigned apps by default for safety

### Is This Safe?

**Yes, Transcript Parser is safe** if you download it from the official source:

✅ **Official GitHub Repository**: [https://github.com/KevenWMarkham/transcript-parser/releases](https://github.com/KevenWMarkham/transcript-parser/releases)

❌ **DO NOT download from**:

- Third-party download sites
- Email attachments from unknown senders
- Pop-up ads or suspicious websites
- File sharing platforms

### What is Code Signing?

Code signing is a process where developers purchase a certificate to "sign" their applications. Benefits include:

- ✅ Proves the software comes from a verified publisher
- ✅ Shows the file hasn't been tampered with
- ✅ Eliminates Windows Defender warnings

**Why isn't Transcript Parser signed?**

- Code signing certificates cost $300-500 per year
- This is an open-source project without commercial funding
- The source code is publicly available for review on GitHub

---

## Installation Methods

### Method 1: Standard Installation (Recommended)

Use this method to install Transcript Parser for all users on your computer.

#### Step 1: Download the Installer

1. Visit the [Releases page](https://github.com/KevenWMarkham/transcript-parser/releases)
2. Download `Transcript Parser Setup 1.0.0.exe`
3. Save to your Downloads folder

#### Step 2: Handle Windows Defender SmartScreen

When you try to run the installer, you'll see:

**"Windows protected your PC"**

```
Microsoft Defender SmartScreen prevented an unrecognized app from starting.
Running this app might put your PC at risk.

App: Transcript Parser Setup 1.0.0.exe
Publisher: Unknown publisher
```

**To proceed safely:**

1. Click **"More info"** (small blue text at the bottom)
2. A new button appears: **"Run anyway"**
3. Click **"Run anyway"**
4. The installer will now launch

#### Step 3: User Account Control (UAC) Prompt

You'll see a UAC prompt asking:

```
Do you want to allow this app to make changes to your device?
Transcript Parser Setup
Unverified publisher
```

1. Click **"Yes"** to proceed
2. The installation wizard will open

#### Step 4: Complete Installation

1. Choose installation directory (default: `C:\Program Files\Transcript Parser`)
2. Click **"Install"**
3. Wait for installation to complete
4. Click **"Finish"**

The application is now installed and can be launched from the Start Menu.

---

### Method 2: Portable Version

The portable version doesn't require installation and may have fewer security warnings.

#### Step 1: Download the Portable Version

1. Visit the [Releases page](https://github.com/KevenWMarkham/transcript-parser/releases)
2. Download `Transcript Parser 1.0.0.exe` (portable)
3. Save to a folder like `C:\Tools\TranscriptParser\`

#### Step 2: Handle Windows Defender SmartScreen

When you double-click the portable executable:

1. Right-click the executable
2. Select **"Properties"**
3. At the bottom, you may see:
   ```
   Security: This file came from another computer and might be blocked
   to help protect this computer.
   ```
4. Check the box: **"Unblock"**
5. Click **"Apply"** then **"OK"**

#### Step 3: Run the Application

1. Double-click `Transcript Parser 1.0.0.exe`
2. If SmartScreen still appears, click **"More info"** → **"Run anyway"**
3. The application will launch

The portable version stores settings in the same folder as the executable.

---

## Windows Defender SmartScreen Bypass

### Visual Guide: Bypassing SmartScreen

#### Warning Screen

```
┌────────────────────────────────────────────────────────────┐
│  Windows protected your PC                                  │
│                                                              │
│  Microsoft Defender SmartScreen prevented an unrecognized   │
│  app from starting. Running this app might put your PC at   │
│  risk.                                                       │
│                                                              │
│  App: Transcript Parser Setup 1.0.0.exe                     │
│  Publisher: Unknown publisher                                │
│                                                              │
│  ┌──────────────┐                                           │
│  │   Don't run  │  ◄── Default option                       │
│  └──────────────┘                                           │
│                                                              │
│  More info  ◄── CLICK THIS                                  │
└────────────────────────────────────────────────────────────┘
```

#### After Clicking "More info"

```
┌────────────────────────────────────────────────────────────┐
│  Windows protected your PC                                  │
│                                                              │
│  Microsoft Defender SmartScreen prevented an unrecognized   │
│  app from starting. Running this app might put your PC at   │
│  risk.                                                       │
│                                                              │
│  App: Transcript Parser Setup 1.0.0.exe                     │
│  Publisher: Unknown publisher                                │
│                                                              │
│  ┌──────────────┐                                           │
│  │   Don't run  │                                           │
│  └──────────────┘                                           │
│                                                              │
│  ┌──────────────┐                                           │
│  │  Run anyway  │  ◄── CLICK THIS                           │
│  └──────────────┘                                           │
│                                                              │
│  More info                                                   │
└────────────────────────────────────────────────────────────┘
```

### Alternative Methods

#### Method A: Temporarily Disable SmartScreen (Not Recommended)

**Only use if you trust the source completely.**

1. Open **Windows Security**
2. Go to **App & browser control**
3. Click **Reputation-based protection settings**
4. Turn OFF **Check apps and files**
5. Install the application
6. **IMPORTANT**: Turn SmartScreen back ON after installation

#### Method B: Add to Exclusions

Add the installer to Windows Defender exclusions:

1. Open **Windows Security**
2. Go to **Virus & threat protection**
3. Click **Manage settings** under "Virus & threat protection settings"
4. Scroll to **Exclusions**
5. Click **Add or remove exclusions**
6. Click **Add an exclusion** → **File**
7. Browse to the installer/executable
8. Click **Open**

---

## Antivirus Software Warnings

### Third-Party Antivirus Software

If you have antivirus software like Norton, McAfee, Avast, AVG, or Kaspersky, you may see additional warnings.

#### Common Warning Messages

1. **"Suspicious file detected"**
2. **"Unknown publisher"**
3. **"Low reputation"**
4. **"Untrusted executable"**

#### How to Proceed

Each antivirus is different, but general steps:

1. **Norton/Symantec**:
   - Click **"More Options"** or **"Advanced"**
   - Select **"Allow"** or **"Trust"**

2. **McAfee**:
   - Click **"Restore"** if quarantined
   - Add to **"Trusted Applications"**

3. **Avast/AVG**:
   - Click **"More details"**
   - Select **"Allow"** or **"Add exception"**

4. **Kaspersky**:
   - Click **"More details"**
   - Select **"Allow"** or **"Add to exclusions"**

5. **Bitdefender**:
   - Go to **Protection** → **Antivirus**
   - Click **Manage Exceptions**
   - Add the executable

### Adding to Trusted Applications

Most antivirus software allows you to mark applications as trusted:

1. Open your antivirus software
2. Look for **"Exclusions"**, **"Exceptions"**, or **"Trusted Applications"**
3. Add the installer and installation directory:
   - `C:\Users\YourName\Downloads\Transcript Parser Setup 1.0.0.exe`
   - `C:\Program Files\Transcript Parser\`

---

## Verifying File Integrity

To ensure your download hasn't been tampered with, verify the file hash.

### Using PowerShell (Windows 10/11)

1. Open PowerShell:
   - Press `Win + X`
   - Select **"Windows PowerShell"** or **"Terminal"**

2. Navigate to your Downloads folder:

   ```powershell
   cd $env:USERPROFILE\Downloads
   ```

3. Calculate the SHA256 hash:

   ```powershell
   Get-FileHash "Transcript Parser Setup 1.0.0.exe" -Algorithm SHA256
   ```

4. Compare the output with the official hash:

   ```
   Algorithm : SHA256
   Hash      : [HASH WILL BE DISPLAYED HERE]
   Path      : C:\Users\YourName\Downloads\Transcript Parser Setup 1.0.0.exe
   ```

5. Verify the hash matches the one published on the [Releases page](https://github.com/KevenWMarkham/transcript-parser/releases)

### File Hashes (Official)

**Version 1.0.0 Checksums:**

_Note: Checksums will be added to future releases. For now, verify by downloading only from the official GitHub repository._

---

## Troubleshooting

### Issue 1: "This app has been blocked by your administrator"

**Cause**: Group Policy or organization policy blocks unsigned apps.

**Solutions**:

1. **For Home Users**:
   - Check if parental controls are enabled
   - Verify you have administrator privileges
   - Try running as administrator: Right-click → **"Run as administrator"**

2. **For Work/School Computers**:
   - Contact your IT administrator
   - They may need to whitelist the application
   - Provide them with this documentation

### Issue 2: "Windows cannot access the specified device, path, or file"

**Cause**: Windows Defender or antivirus blocked the file.

**Solution**:

1. Check if the file was quarantined by your antivirus
2. Restore the file from quarantine
3. Add to exclusions (see [Antivirus Software Warnings](#antivirus-software-warnings))

### Issue 3: Installer Deleted After Download

**Cause**: Windows Defender automatically deleted the file.

**Solution**:

1. Open **Windows Security** → **Virus & threat protection**
2. Click **Protection history**
3. Find **"Transcript Parser Setup 1.0.0.exe"**
4. Click **"Actions"** → **"Restore"**
5. Add to exclusions before running

### Issue 4: "Application failed to initialize properly"

**Cause**: Missing system dependencies or corrupted download.

**Solution**:

1. Delete the downloaded file
2. Re-download from the official source
3. Verify file hash (see [Verifying File Integrity](#verifying-file-integrity))
4. Try the portable version instead

### Issue 5: Installation Hangs or Freezes

**Cause**: Antivirus scanning the installer in real-time.

**Solution**:

1. Temporarily disable real-time scanning
2. Run the installer
3. Re-enable real-time scanning after installation

---

## For IT Administrators

### Deploying in Corporate Environments

#### Group Policy Configuration

Allow Transcript Parser through AppLocker or Software Restriction Policies:

1. **AppLocker**:

   ```
   Computer Configuration
     → Windows Settings
       → Security Settings
         → Application Control Policies
           → AppLocker
             → Executable Rules
   ```

   Create a rule allowing the executable path or publisher.

2. **Software Restriction Policies**:
   - Add `C:\Program Files\Transcript Parser\` to unrestricted paths
   - Add installer hash to unrestricted applications

#### Microsoft Defender Application Control (MDAC)

Create a policy to allow Transcript Parser:

```powershell
# Create a new MDAC policy
New-CIPolicy -FilePath "TranscriptParser.xml" -ScanPath "C:\Program Files\Transcript Parser" -Level Hash

# Convert to binary policy
ConvertFrom-CIPolicy -XmlFilePath "TranscriptParser.xml" -BinaryFilePath "TranscriptParser.p7b"

# Deploy via Intune or GPO
```

#### Silent Installation (MSI - Future Release)

For enterprise deployments, a signed MSI package is planned for version 1.1:

```batch
msiexec /i "TranscriptParser.msi" /qn /norestart
```

#### Endpoint Protection Exclusions

**Microsoft Defender** (via GPO):

```
Computer Configuration
  → Administrative Templates
    → Windows Components
      → Microsoft Defender Antivirus
        → Exclusions
          → Path Exclusions: C:\Program Files\Transcript Parser\
```

**Third-Party Antivirus**:

- Add installation directory to exclusions
- Add installer to trusted applications
- Contact your antivirus vendor for enterprise policies

#### Network Deployment

Deploy via SCCM, Intune, or PDQ Deploy:

1. Create a package with the installer
2. Configure silent installation parameters
3. Add pre-installation script to disable SmartScreen temporarily
4. Deploy to target machines
5. Re-enable SmartScreen post-installation

---

## Additional Resources

### Official Links

- **GitHub Repository**: [https://github.com/KevenWMarkham/transcript-parser](https://github.com/KevenWMarkham/transcript-parser)
- **Releases**: [https://github.com/KevenWMarkham/transcript-parser/releases](https://github.com/KevenWMarkham/transcript-parser/releases)
- **Issue Tracker**: [https://github.com/KevenWMarkham/transcript-parser/issues](https://github.com/KevenWMarkham/transcript-parser/issues)
- **User Manual**: [docs/user-manual.md](user-manual.md)

### Windows Security Documentation

- [SmartScreen Overview](https://docs.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-smartscreen/)
- [Code Signing Best Practices](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/code-signing-best-practices)
- [AppLocker Documentation](https://docs.microsoft.com/en-us/windows/security/threat-protection/windows-defender-application-control/applocker/applocker-overview)

### Support

If you encounter issues not covered in this guide:

1. Check the [User Manual](user-manual.md) troubleshooting section
2. Search existing [GitHub Issues](https://github.com/KevenWMarkham/transcript-parser/issues)
3. Create a new issue with:
   - Windows version
   - Antivirus software (if any)
   - Exact error message
   - Screenshots of the warnings

---

## FAQ

**Q: Is Transcript Parser safe to install?**
A: Yes, if downloaded from the official GitHub repository. The warnings are because the app is not signed, not because it's malicious.

**Q: Why don't you just sign the application?**
A: Code signing certificates cost $300-500/year. This is an open-source project without commercial funding. A signed version may be available in future releases if funding becomes available.

**Q: Will these warnings go away in the future?**
A: Yes, when:

- The application is code-signed with a certificate
- Enough users download it to build "reputation" with Microsoft
- An MSI installer is released (planned for v1.1)

**Q: Can I build the application myself to avoid warnings?**
A: Yes! The source code is available on GitHub. See the [Installation Guide](installation-guide.md) for instructions on building from source.

**Q: Does the portable version have fewer warnings?**
A: Sometimes. The portable version doesn't require administrator privileges, which may reduce some warnings. However, SmartScreen warnings will still appear.

**Q: My antivirus deleted the file automatically. What do I do?**
A: Restore the file from quarantine and add it to your antivirus exclusions before running it.

**Q: Is there a version that doesn't trigger warnings?**
A: Building from source yourself won't trigger SmartScreen warnings since you're the "publisher" on your own machine.

---

## Summary

Installing Transcript Parser on Windows is safe despite security warnings. The warnings appear because:

- ✅ The app is not code-signed (expensive certificate)
- ✅ It's a new application without Microsoft "reputation"
- ✅ Windows errs on the side of caution

**To install safely:**

1. Download only from the official GitHub repository
2. Click **"More info"** → **"Run anyway"** in SmartScreen
3. Click **"Yes"** on the UAC prompt
4. Add to antivirus exclusions if needed

**Remember**: These are security warnings for _unsigned_ applications, not _malicious_ applications. The source code is publicly available for review on GitHub.

---

_Last Updated: December 19, 2024 • Version 1.0.0_

**Need help?** Visit the [GitHub Issues](https://github.com/KevenWMarkham/transcript-parser/issues) page or check the [User Manual](user-manual.md).
