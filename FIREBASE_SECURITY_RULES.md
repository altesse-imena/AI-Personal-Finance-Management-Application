# Firebase Security Rules Guide

This guide explains how to set up Firebase security rules for your Personal Finance Management Application.

## Firestore Security Rules

Copy and paste the following rules into your Firebase Console under Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to user profiles
      match /profile {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Allow access to user transactions
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Allow access to user goals
      match /goals/{goalId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Apply These Rules

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the existing rules with the rules above
6. Click "Publish"

## Understanding the Rules

These rules enforce the following security model:

1. Users can only read and write their own data
2. The data is organized by user ID
3. Each user has their own profile, transactions, and goals collections
4. All other access is denied by default

## Data Structure

Based on these rules, your Firestore database should be structured as follows:

```
/users/{userId}/profile
/users/{userId}/transactions/{transactionId}
/users/{userId}/goals/{goalId}
```

## Testing the Rules

You can test these rules in the Firebase Console:

1. Go to the "Rules" tab
2. Click "Rules Playground"
3. Select a collection path (e.g., /users/{userId}/transactions/{transactionId})
4. Select an operation (e.g., get, list, create, update, delete)
5. Set the authentication state to "Authenticated" and provide a UID
6. Click "Run"

## Next Steps

Once you've applied these rules, update your Firebase service implementations to follow this data structure. The mock services can serve as a template for how to structure your real Firebase services.
