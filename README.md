# Remembrance

Remembrance is a mobile storytelling application built with React Native and Expo.  
The app allows users to create, manage, and store personal stories together with photos.

Users can:
- create stories with images
- edit and delete existing stories
- browse stories in a clean grid layout
- securely authenticate with Supabase

The project uses Supabase for authentication, database management, and image storage.

---

## Features

- User authentication (Sign up / Sign in)
- Create, edit, and delete stories
- Camera integration for capturing photos
- Image upload and storage with Supabase Storage
- Responsive grid-based story overview
- Story detail view
- Persistent cloud database
- Navigation with Expo Router

---

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- Supabase
  - Authentication
  - PostgreSQL Database
  - Storage
- Jest

---

## Screens

- Authentication Screen
- Stories Overview
- Add Story
- Story Details
- Edit Story

---

## Installation

### Requirements

- Node.js (LTS recommended)
- npm
- Expo CLI
- Expo Go App

### Setup

```bash
npm install
npx expo start
```

---

## Project Structure

```text
app/
├─ index.tsx
├─ _layout.tsx
└─ stories/
   ├─ index.tsx
   ├─ add.tsx
   ├─ [id].tsx
   └─ edit/
      └─ [id].tsx
```

---

## Camera & Storage

The app uses the device camera to capture images for stories.  
Photos are uploaded directly to Supabase Storage and linked to the corresponding story entry.

---

## Testing

The application was tested manually on:
- Expo Go
- Android APK builds via EAS

Core functionality including authentication, story management, navigation, and image upload was verified successfully.

---

## Build

Android builds were generated using Expo Application Services (EAS).

Build link:  
https://expo.dev/accounts/ogyyre/projects/remembrance/builds/da1fe802-db20-431f-b79f-699435fd296e

---

## Future Improvements

Possible future enhancements:
- improved Android UI spacing
- better image management
- relational media handling
- enhanced offline support
