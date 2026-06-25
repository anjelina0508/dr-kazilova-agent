const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'site', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Extract the about section (everything from <section id="about"> to its </section>)
const aboutMatch = html.match(/(<section id="about">[\s\S]*?<\/section>)\n\n(<section id="diploms">)/);
if (!aboutMatch) {
  console.error('About section not found');
  process.exit(1);
}

const aboutSection = aboutMatch[1];

// Extract the services section
const servicesMatch = html.match(/(<section id="services">[\s\S]*?<\/section>)\n\n(<section id="portfolio")/);
if (!servicesMatch) {
  console.error('Services section not found');
  process.exit(1);
}

const servicesSection = servicesMatch[1];

// Step 1: Remove about section from its current position,
//         replace with a marker so we can put services before about later
html = html.replace(aboutSection + '\n\n' + '<section id="diploms">', '%%%ABOUT_GOES_HERE%%%' + '\n\n' + '<section id="diploms">');

// Step 2: Remove services section from its current position,
//         replace with a marker
html = html.replace(servicesSection + '\n\n' + '<section id="portfolio"', '%%%SERVICES_GONE%%%' + '\n\n' + '<section id="portfolio"');

// Step 3: Put services then about in the right place (services replaces the about marker)
html = html.replace('%%%ABOUT_GOES_HERE%%%', servicesSection + '\n\n' + aboutSection);

// Step 4: Remove the empty services marker
html = html.replace('%%%SERVICES_GONE%%%\n\n', '');

// Step 5: Fix nav order - put Услуги before Обо мне
html = html.replace(
  '<li><a href="#about">Обо мне</a></li>\n    <li><a href="#diploms">Дипломы</a></li>\n    <li><a href="#services">Услуги</a></li>',
  '<li><a href="#services">Услуги</a></li>\n    <li><a href="#about">Обо мне</a></li>\n    <li><a href="#diploms">Дипломы</a></li>'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Секции переставлены: Герой → Статистика → Услуги → Обо мне → Дипломы');
