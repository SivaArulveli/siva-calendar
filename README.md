# Siva Vaibhava Panchangam - Admin & Update Guide

Welcome to the **Siva Vaibhava Panchangam** project. This document explains how to manage the calendar data, use the Admin dashboard, and update day cards.

## 1. Admin Access

The application includes an Admin mode that allows you to edit cards directly in the browser and export the data as JSON.

### How to Login
1.  Navigate to the calendar in your browser.
2.  Click the **"Admin"** button in the top-right corner.
3.  Enter the passcode: `omnamahshivaya`
4.  *Alternatively:* Append `?admin=true` to your URL (e.g., `http://localhost:3001/?admin=true`).

### Admin Features
-   **Add/Edit Cards:** Click on any date to open the editor. You can change titles, descriptions, and images.
-   **Month JSON Export:** In Admin mode, click the "Month JSON" button to download the current month's data as a formatted JSON file.
-   **Import:** You can upload an existing JSON file to restore or merge data.

---

## 2. Managing Data (JSON)

The master data for the calendar is stored in:
`public/data/day_cards.json`

### New Data Schema
The application uses a nested JSON schema. Each day card contains:
-   `tamil_date`: Detailed labels and numbers.
-   `visual`: Placeholder image URLs and alt text.
-   `cycles`: Lunar phase and Solar cycle (Ayanam) icons.
-   `events`: An array of events with priority and icons.

---

## 3. Automation Scripts

Several scripts are included to help you manage data and images in bulk.

### Data Generation
If you want to generate sample data or clear the calendar for a specific period:
-   **Full Year Generation:** `node generate_full_parabhava.cjs`
    -   Generates a continuous 16-month dataset from Jan 2026 to Apr 2027.
    -   Automatically assigns images and special events.
-   **Specific Image Data:** `node generate_events_from_image.cjs`
    -   Transcribes specific events from the provided spreadsheet data.

### Image Optimization
To add new photos to the calendar:
1.  Place your `.jpg` photos in `public/images/`.
2.  Run: `node optimize_images.cjs`
    -   This script resizes images to 800px width and converts them to `.webp` for fast loading.
3.  The optimized images can then be referenced in `day_cards.json` as `/images/your_image.webp`.

---

## 4. Development Commands

-   **Start Dev Server:** `npm run dev`
-   **Build for Production:** `npm run build`
-   **Run on Specific Port:** `npx vite dev --port 3001`

---

## 5. Deployment

This project is configured for **GitHub Pages**. 
1.  Ensure all changes are committed and pushed to your repository.
2.  The GitHub Action will automatically build and deploy the site to `https://SivaArulveli.github.io/siva-cal/`.

---

## 6. Sample JSON Schema

For manual edits, use the following structure for a single day entry inside the `days` array:

```json
{
  "id": "2026-05-09",
  "tamil_date": {
    "label_ta": "சித்திரை 26",
    "label_en": "Chithirai 26",
    "day_ta": "26",
    "day_en": "26"
  },
  "gregorian_date": {
    "iso": "2026-05-09",
    "display_en": "May 9, 2026"
  },
  "weekday": {
    "ta": "சனி",
    "en": "Saturday"
  },
  "visual": {
    "placeholder_image_url": "/images/Siva-1.webp",
    "placeholder_alt_text": "Siva Vaibhava Panchangam Event",
    "theme_tag": "regular"
  },
  "cycles": {
    "lunar_phase_icon": "new_moon",
    "solar_cycle_icon": "uttarayana"
  },
  "events": [
    {
      "title_ta": "Thiruoonam",
      "title_en": "Thiruoonam",
      "description_ta": "Siva Swamigal Sidhi natchathira Abhishegam",
      "description_en": "Siva Swamigal Sidhi natchathira Abhishegam",
      "importance_level": "high",
      "icon": "star"
    }
  ]
}
```
