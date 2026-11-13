import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import sharp from 'sharp';

async function createAndroidPackage() {
  console.log('Generating complete Android Studio Project & Offline Web Zip...');

  const zip = new JSZip();

  // 1. Root Gradle files
  zip.file('build.gradle', `// Top-level build file
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`);

  zip.file('settings.gradle', `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "TajweedKids"
include ':app'
`);

  zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
`);

  zip.file('gradle/wrapper/gradle-wrapper.properties', `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`);

  // 2. App Module build.gradle & proguard-rules.pro
  zip.file('app/build.gradle', `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.tajweedkids.app'
    compileSdk 34

    defaultConfig {
        applicationId "com.tajweedkids.app"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.10.0'
}
`);

  zip.file('app/proguard-rules.pro', `# Keep WebView JavaScript interfaces and AndroidX classes
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
`);

  // 3. AndroidManifest.xml
  zip.file('app/src/main/AndroidManifest.xml', `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|keyboardHidden|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`);

  // 4. MainActivity.java using WebViewAssetLoader (HTTPS origin for ES modules & Mic API)
  zip.file('app/src/main/java/com/tajweedkids/app/MainActivity.java', `package com.tajweedkids.app;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private static final int RECORD_AUDIO_REQUEST_CODE = 101;
    private PermissionRequest pendingPermissionRequest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView.setWebViewClient(new WebViewClient() {
            @Nullable
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if ("appassets.androidplatform.net".equals(url.getHost())) {
                    return false;
                }
                Intent intent = new Intent(Intent.ACTION_VIEW, url);
                startActivity(intent);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    for (String resource : request.getResources()) {
                        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) {
                            if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO)
                                    == PackageManager.PERMISSION_GRANTED) {
                                request.grant(request.getResources());
                            } else {
                                pendingPermissionRequest = request;
                                ActivityCompat.requestPermissions(MainActivity.this,
                                        new String[]{Manifest.permission.RECORD_AUDIO},
                                        RECORD_AUDIO_REQUEST_CODE);
                            }
                            return;
                        }
                    }
                    request.grant(request.getResources());
                }
            }
        });

        // Request audio permission proactively for voice practice
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO},
                    RECORD_AUDIO_REQUEST_CODE);
        }

        // Load offline packaged Tajweed Kids app over secure HTTPS asset origin
        webView.loadUrl("https://appassets.androidplatform.net/index.html");
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == RECORD_AUDIO_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && pendingPermissionRequest != null) {
                    pendingPermissionRequest.grant(pendingPermissionRequest.getResources());
                    pendingPermissionRequest = null;
                }
            }
        }
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`);

  // 5. Resources: strings.xml, styles.xml, and mipmap launcher icons
  zip.file('app/src/main/res/values/strings.xml', `<resources>
    <string name="app_name">تجوید کڈز</string>
</resources>
`);

  zip.file('app/src/main/res/values/styles.xml', `<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="colorPrimary">#059669</item>
        <item name="colorPrimaryDark">#047857</item>
        <item name="colorAccent">#F59E0B</item>
        <item name="android:statusBarColor">#047857</item>
    </style>
</resources>
`);

  const iconSvgPath = path.resolve('public/icon.svg');
  if (fs.existsSync(iconSvgPath)) {
    const svgBuffer = fs.readFileSync(iconSvgPath);
    const densities = [
      { folder: 'mipmap-mdpi', size: 48 },
      { folder: 'mipmap-hdpi', size: 72 },
      { folder: 'mipmap-xhdpi', size: 96 },
      { folder: 'mipmap-xxhdpi', size: 144 },
      { folder: 'mipmap-xxxhdpi', size: 192 },
    ];
    for (const d of densities) {
      const png = await sharp(svgBuffer).resize(d.size, d.size).png().toBuffer();
      zip.file(`app/src/main/res/${d.folder}/ic_launcher.png`, png);
      zip.file(`app/src/main/res/${d.folder}/ic_launcher_round.png`, png);
    }
  }

  // 6. GitHub Actions workflow to auto-build APK & AAB in the cloud for free
  zip.file('.github/workflows/build-apk.yml', `name: Build Android APK & AAB

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Setup Gradle 8.4
        uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.4'

      - name: Build Debug APK
        run: gradle assembleDebug

      - name: Build Release AAB
        run: gradle bundleRelease

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: tajweed-kids-apk
          path: app/build/outputs/apk/debug/app-debug.apk

      - name: Upload Play Store AAB Artifact
        uses: actions/upload-artifact@v4
        with:
          name: tajweed-kids-aab
          path: app/build/outputs/bundle/release/app-release.aab
`);

  // 7. Copy compiled dist/ files into app/src/main/assets/
  const distDir = path.resolve('dist');
  const offlineZip = new JSZip();

  function addDirToZip(baseDir, zipFolder, offlineFolder) {
    if (!fs.existsSync(baseDir)) return;
    const items = fs.readdirSync(baseDir);
    for (const item of items) {
      if (item.endsWith('.zip')) continue; // avoid nesting output zips inside assets
      const fullPath = path.join(baseDir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subZip = zipFolder.folder(item);
        const subOffline = offlineFolder.folder(item);
        addDirToZip(fullPath, subZip, subOffline);
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(item, content);
        offlineFolder.file(item, content);
      }
    }
  }

  const assetsFolder = zip.folder('app/src/main/assets');
  addDirToZip(distDir, assetsFolder, offlineZip);

  // Add Play Store assets into zip
  const playstoreFolder = zip.folder('playstore-assets');
  if (fs.existsSync('public/playstore-feature-graphic.png')) {
    playstoreFolder.file('feature-graphic-1024x500.png', fs.readFileSync('public/playstore-feature-graphic.png'));
  }
  if (fs.existsSync('public/playstore-icon-512.png')) {
    playstoreFolder.file('icon-512x512.png', fs.readFileSync('public/playstore-icon-512.png'));
  }
  if (fs.existsSync('public/privacy.html')) {
    playstoreFolder.file('privacy-policy.html', fs.readFileSync('public/privacy.html'));
  }

  // README guide
  zip.file('README_PLAY_STORE_AND_APK_GUIDE.txt', `=====================================================
TAJWEED KIDS - ANDROID APK & PLAY STORE BUILD GUIDE
تجوید کڈز - اینڈرائیڈ اے پی کے اور پلے اسٹور گائیڈ
=====================================================

OPTION A: BUILD APK WITHOUT INSTALLING ANDROID STUDIO (FREE VIA GITHUB)
1. Create a free repository on github.com and upload the extracted files from this ZIP.
2. Go to the "Actions" tab in GitHub -> run "Build Android APK & AAB".
3. Download "tajweed-kids-apk" (app-debug.apk) and "tajweed-kids-aab" directly!

OPTION B: BUILD LOCALLY IN ANDROID STUDIO
1. Extract this .zip and open the folder in Android Studio.
2. Wait for Gradle sync to finish.
3. For APK (Direct Phone Install):
   Build -> Build Bundle(s) / APK(s) -> Build APK(s)
4. For AAB (Google Play Store):
   Build -> Generate Signed Bundle / APK... -> Android App Bundle (.aab)

=====================================================
`);

  // Generate public ZIP files
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const androidZipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(publicDir, 'tajweed-kids-android-project.zip'), androidZipBuffer);
  console.log('Created: public/tajweed-kids-android-project.zip (' + (androidZipBuffer.length / 1024).toFixed(1) + ' KB)');

  const offlineZipBuffer = await offlineZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(publicDir, 'tajweed-kids-offline-app.zip'), offlineZipBuffer);
  console.log('Created: public/tajweed-kids-offline-app.zip (' + (offlineZipBuffer.length / 1024).toFixed(1) + ' KB)');
}

createAndroidPackage();
