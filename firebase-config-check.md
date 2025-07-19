# Firebase Project Configuration Check

## Current Configuration Issues

### 1. VAPID Key Configuration
**Current VAPID Key:** `BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk`

**Steps to verify in Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `alert-1af29`
3. Go to **Project Settings** (gear icon)
4. Go to **Cloud Messaging** tab
5. Check **Web configuration** section
6. Verify the VAPID key matches the one in your code
7. If different, update your code with the correct VAPID key

### 2. Firebase Project Configuration
**Current Config:**
```javascript
{
  apiKey: "AIzaSyB0q6Y0WtN7rIR5Zoau-7qghjRKL6k3Sfg",
  authDomain: "alert-1af29.firebaseapp.com",
  projectId: "alert-1af29",
  storageBucket: "alert-1af29.firebasestorage.app",
  messagingSenderId: "729990985266",
  appId: "1:729990985266:web:0a1d98102caefd4c406e2b"
}
```

**Verification Steps:**
1. In Firebase Console, go to **Project Settings**
2. Scroll down to **Your apps** section
3. Check if your web app is registered
4. If not, add a web app with the same configuration
5. Verify all values match your code

### 3. Cloud Messaging Service Worker
**Current Service Worker:** `/firebase-messaging-sw.js`

**Issues to Check:**
1. **Service Worker Registration**: Ensure the service worker is properly registered
2. **Scope**: Verify the service worker scope covers your entire app
3. **Firebase SDK Version**: Check if using compatible Firebase SDK versions

### 4. Firebase Cloud Messaging Setup
**Required Steps in Firebase Console:**
1. **Enable Cloud Messaging**: Go to **Cloud Messaging** in Firebase Console
2. **Generate VAPID Key**: If not already done, generate a new VAPID key
3. **Configure Web Push Certificates**: Ensure web push certificates are set up
4. **Test Message**: Send a test message from Firebase Console

## Testing Steps

### Step 1: Verify Firebase Configuration
```javascript
// Run this in browser console
console.log("Firebase Config Check:");
console.log("Project ID:", firebase.app().options.projectId);
console.log("Messaging Sender ID:", firebase.app().options.messagingSenderId);
console.log("App ID:", firebase.app().options.appId);
```

### Step 2: Test VAPID Key
```javascript
// Test VAPID key validity
firebase.messaging().getToken({ 
  vapidKey: "BDSGH9B7lsMx4IMvQoJICO9Y2Z5jje9Tr24qxjwP__kfa_z-g2Sd3OC8qnb-Td68OXOOy1DJLNBX_DdpDRpGCDk" 
}).then(token => {
  console.log("Token obtained:", !!token);
  if (token) {
    console.log("VAPID key is working");
  }
}).catch(error => {
  console.error("VAPID key error:", error);
});
```

### Step 3: Send Test Message from Firebase Console
1. Go to **Cloud Messaging** in Firebase Console
2. Click **Send your first message**
3. Fill in:
   - **Notification title**: "Test Notification"
   - **Notification text**: "This is a test message"
4. Under **Target**, select **Single device**
5. Paste your Firebase token (obtained from console)
6. Send the message

## Common Issues and Solutions

### Issue 1: Invalid VAPID Key
**Symptoms:** Token generation fails
**Solution:** Generate new VAPID key in Firebase Console

### Issue 2: Service Worker Not Registered
**Symptoms:** Background notifications don't work
**Solution:** Check service worker registration in browser dev tools

### Issue 3: Firebase Project Not Configured for Web
**Symptoms:** Firebase initialization fails
**Solution:** Add web app to Firebase project

### Issue 4: Cloud Messaging Not Enabled
**Symptoms:** No push notifications received
**Solution:** Enable Cloud Messaging in Firebase Console

## Debugging Commands

### Check Service Worker Status
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log("Service Workers:", registrations);
  const firebaseSW = registrations.find(reg => 
    reg.active?.scriptURL.includes('firebase-messaging-sw.js')
  );
  console.log("Firebase SW:", firebaseSW);
});
```

### Check Notification Permission
```javascript
console.log("Notification Permission:", Notification.permission);
console.log("Notification API Supported:", "Notification" in window);
```

### Test Local Notification
```javascript
if (Notification.permission === "granted") {
  new Notification("Test", { body: "Local notification test" });
}
```

## Next Steps

1. **Verify Firebase Console Configuration**
2. **Check VAPID Key in Project Settings**
3. **Test Token Generation**
4. **Send Test Message from Firebase Console**
5. **Check Browser Console for Errors**
6. **Verify Service Worker Registration**

## Firebase Console URLs

- **Project Settings**: https://console.firebase.google.com/project/alert-1af29/settings
- **Cloud Messaging**: https://console.firebase.google.com/project/alert-1af29/messaging
- **Project Overview**: https://console.firebase.google.com/project/alert-1af29 