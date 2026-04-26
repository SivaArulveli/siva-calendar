const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/data/day_cards.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let updatedCount = 0;

for (const day of data.days) {
  if (day.events && Array.isArray(day.events)) {
    for (const event of day.events) {
      if (event.title_en === 'Thiruoonam' || event.title_en === 'Thiruoosnam' || event.title_ta === 'Thiruoonam' || event.title_ta === 'Thiruoosnam') {
        event.title_ta = 'Thiruoonam';
        event.title_en = 'Thiruoonam';
        
        // Don't overwrite if it already has something more specific (like the Thai Ammavasya one) unless requested, 
        // but the user said "add description on where you see title Thiruoonam".
        // The Thai Ammavasya one has title "Thiruoonam" but description "Thai Ammavasya & Thiruoonam & Gurupooja".
        // Let's preserve that specific one by appending, or just overwriting empty ones.
        // Actually, the user specifically wants: "add description on where you see title "Thiruoonam" as "Siva Swamigal Sidhi natchathira Abhishegam""
        
        if (!event.description_en || event.description_en === 'Siva Swamigal Sidhi natchathira Abhishegam' || event.description_en === '') {
            event.description_ta = 'Siva Swamigal Sidhi natchathira Abhishegam';
            event.description_en = 'Siva Swamigal Sidhi natchathira Abhishegam';
        } else if (!event.description_en.includes('Siva Swamigal')) {
            // If it has other text like "Thai Ammavasya", append it.
            event.description_ta = event.description_ta + ' | Siva Swamigal Sidhi natchathira Abhishegam';
            event.description_en = event.description_en + ' | Siva Swamigal Sidhi natchathira Abhishegam';
        }
        
        updatedCount++;
      }
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Successfully updated ${updatedCount} Thiruoonam events.`);
