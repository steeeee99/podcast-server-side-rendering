# podcast-server-side-rendering

App-mobile only
Html,Css,Bootrap,Nodejs, Express, bcrypt,sqlite

Requisiti funzionali - descrizione
Si vuole realizzare un’applicazione web per la gestione di podcast. In particolare, l’applicazione web deve supportare due tipi di utenti registrati: i creatori e gli ascoltatori.
I creatori possono creare, modificare o cancellare una serie di podcast, nonché di aggiungere, modificare e cancellare i singoli episodi di una loro serie.
Una serie di podcast è composta da un titolo, una breve descrizione, una categoria, un’immagine, il nome dell’autore (il creatore) e una eventuale lista degli episodi in essa contenuti, ordinati per data. Alla creazione della serie, tutti i campi eccetto la lista degli episodi, sono obbligatori.
Gli episodi sono rappresentati da un file audio, da un titolo, da una descrizione testuale, da una data e da un eventuale sponsor. I singoli episodi possono essere gratuiti oppure a pagamento. Tutti i campi, eccetto lo sponsor, sono obbligatori alla creazione di un episodio.
Un episodio può appartenere a una sola serie e solo il creatore della serie può modificarla (per esempio, aggiungendo un episodio).
Prima di poter agire da creatore, un utente del sito deve registrarsi ed eseguire il login.
Utilizzando l’applicazione web, gli ascoltatori possono ascoltare uno o più episodi, seguire (o smettere di seguire) una o più serie di podcast e salvare uno o più episodi come “preferiti” (o rimuoverlo dai preferiti). Inoltre, gli ascoltatori possono lasciare un commento testuale sotto ogni episodio. Il commento sarà visibile a tutti, ma modificabile e cancellabile solo dall’ascoltatore che l’ha scritto. Nel caso di episodi a pagamento, l’applicazione web chiederà all’ascoltatore i dati della sua carta di credito (nome, cognome, tipo, numero, CCV) e verificherà che i dati siano nel formato corretto, al posto di procedere alla riproduzione. Una volta acquistato, l’episodio sarà disponibile al suo acquirente per sempre (fino all’eventuale cancellazione dell’episodio da parte del suo creatore).
Prima di poter agire da ascoltatore, un utente del sito deve registrarsi ed eseguire il login. Un creatore è anche un ascoltatore, ma non viceversa (non è necessario gestire un eventuale “upgrade” da utente ascoltatore a creatore, in questo momento). Sia ascoltatore che creatore avranno una pagina profilo con le informazioni utili.
Un utente non registrato può, al di là di registrarsi come creatore o ascoltatore, navigare nell’intero sito liberamente e per categoria.
Inoltre, può cercare una serie o un episodio con una ricerca testuale (nei titoli e nelle descrizioni). La ricerca testuale potrà essere raffinata per categoria o scegliendo tra episodi/serie. Per esempio, un utente potrà cercare “JavaScript” tra i soli titoli e descrizioni degli episodi nella categoria “Tecnologia”.
Questa funzionalità è ovviamente offerta a tutti gli utenti del sito, anche a quelli non registrati.

Utenti :
Utente ascoltatore : 
Nome utente : utente1
Pssword: password1

Utente creatore
nome utente : utente2
password : password2
