Gestore Documenti PWA
Un gestore di documenti offline-first, sicuro e privato, che funziona interamente nel tuo browser. Archivia, organizza e ricerca i tuoi file senza mai caricarli su un server.

Introduzione
Questo progetto nasce dall'esigenza di avere un archivio documentale personale che sia veloce, accessibile offline e che rispetti la privacy al 100%. A differenza delle soluzioni basate su cloud, questo gestore documentale è una Progressive Web App (PWA) che salva tutti i dati esclusivamente sul tuo dispositivo, all'interno del browser (usando IndexedDB).

Nessun dato viene mai inviato a un server esterno. Questo significa che i tuoi documenti rimangono sempre e solo tuoi.

Funzionalità Principali
Privacy Totale: Tutti i file e i metadati sono salvati localmente nel tuo browser.

Funzionamento Offline: Accedi e gestisci i tuoi documenti anche senza connessione a internet.

Installabile come App: Essendo una PWA, puoi installarla su desktop e mobile per un'esperienza nativa.

OCR Integrato: Estrai automaticamente il testo da immagini e PDF per popolare i dettagli dei documenti e facilitare la ricerca.

Supporto Multi-formato: Archivia e visualizza anteprime di PDF, immagini (jpg, png), documenti Word (.docx) e fogli di calcolo Excel (.xlsx).

Ricerca e Filtri Avanzati: Cerca per nome, anno, categoria, sottocategoria, tag o contenuto dei dettagli. Filtra la vista ad albero per una navigazione intuitiva.

Organizzazione Flessibile: Assegna categorie, sottocategorie e tag personalizzati a ogni documento.

Tema Chiaro e Scuro: Interfaccia utente che si adatta alle preferenze del tuo sistema.

Import/Export Semplice: Esegui il backup completo del tuo archivio in un singolo file .zip e ripristinalo in qualsiasi momento.

Viste Multiple: Scegli tra la visualizzazione a lista o a griglia per i tuoi documenti.

Tecnologie Utilizzate
Questo progetto è stato costruito interamente con tecnologie client-side, senza dipendenze da backend.

HTML5, CSS3, JavaScript (Vanilla)

Tailwind CSS: Per uno stile moderno e responsivo.

IndexedDB: Il database no-SQL integrato nel browser per l'archiviazione dei dati.

Tesseract.js: Per la funzionalità di Riconoscimento Ottico dei Caratteri (OCR).

PDF.js: Per la visualizzazione di anteprime di file PDF.

JSZip: Per creare e leggere archivi .zip per l'import/export.

docx-preview: Per le anteprime dei documenti Word.

SheetJS (xlsx): Per le anteprime dei fogli di calcolo Excel.

Lucide Icons: Per le icone.

Come Utilizzarlo
Dato che è un'applicazione puramente client-side, non c'è un processo di build complesso.

Hosting Semplice:
Puoi caricare i file (index.html, manifest.json, service-worker.js) su qualsiasi servizio di hosting statico (come GitHub Pages, Netlify, Vercel, ecc.).

Uso in Locale:
Per eseguirlo in locale, è necessario servirlo tramite un server web locale a causa delle policy di sicurezza dei browser (in particolare per il Service Worker). Un modo semplice è usare l'estensione Live Server per Visual Studio Code.

Contributi
I contributi sono benvenuti! Se hai idee per migliorare l'applicazione, sentiti libero di aprire una issue o una pull request.

Progetto sviluppato da Michele Rosati.
