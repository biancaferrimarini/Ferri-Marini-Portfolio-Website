# Il tuo portfolio su GitHub e Pages CMS

Il sito e i moduli sono preparati. Il collegamento al TUO GitHub non e ancora attivo: dovrai autorizzarlo dal tuo account. Non servono password da comunicare a ChatGPT, chiavi segrete o un server a pagamento.

## 1. Pubblica su GitHub: solo la prima volta

1. Completa la registrazione su https://github.com e verifica la tua email.
2. Scegli **+ > New repository**: un repository e la cartella online del sito.
3. Chiamalo **portfolio**, scegli **Public**, poi **Create repository**. Non aggiungere README, licenza o .gitignore: il pacchetto contiene gia i file necessari.
4. Estrai lo ZIP sul computer. La cartella contiene `index.html`, `assets`, `content`, `scripts`, `.pages.yml` e `.github`.
5. Nel progetto GitHub scegli **uploading an existing file**, oppure **Add file > Upload files**.
6. Trascina TUTTO IL CONTENUTO della cartella estratta: non lo ZIP e non la cartella esterna. `index.html` deve apparire direttamente nella pagina principale del progetto.
7. Controlla che siano caricati anche `.pages.yml` e `.github/workflows/pages.yml`: i nomi iniziano con un punto e sono essenziali.
8. Premi **Commit changes**, mantenendo il ramo **main**.
9. Vai su **Settings > Pages > Build and deployment > Source** e scegli **GitHub Actions**. Non scegliere "Deploy from a branch".
10. Vai su **Actions > Publish portfolio > Run workflow > main > Run workflow**. Serve anche se il primo tentativo automatico e fallito prima dell'attivazione di Pages.
11. Attendi il segno verde. In **Settings > Pages** troverai l'indirizzo, solitamente `https://TUO-NOME.github.io/portfolio/`.

I visitatori leggono immagini e modelli dalla copia online su GitHub. Il sito non cerca cartelle sul tuo computer.

## 2. Collega Pages CMS: solo la prima volta

1. Apri https://app.pagescms.org/ e premi **Sign in with GitHub**. Non serve una password separata per Pages CMS.
2. Quando richiesto, installa/autorizza l'app Pages CMS. Scegli **Only select repositories** e seleziona solo **portfolio**.
3. Nel gestionale scegli il tuo account, il progetto **portfolio** e il ramo **main**.
4. Il file `.pages.yml` gia incluso configura **Lavori** e **Collezioni**.
5. Se propone di creare la configurazione da zero, controlla prima che `.pages.yml` sia nella pagina principale del progetto e che il ramo sia main. Non sostituirlo con un modello generico.

Il link **Gestisci portfolio** in fondo al sito apre il gestionale. La pagina di accesso e pubblica, ma modificare i file richiede l'autorizzazione GitHub. Non e un editor finto che salva soltanto sul tuo computer.

## 3. Aggiungi un lavoro

1. Apri **Lavori**, poi il comando per creare una voce (**New entry / Add**; la dicitura puo variare).
2. Scrivi titolo e anno e scegli la collezione.
3. Aggiungi sottotitolo/remake, frase concettuale, descrizione, software e tecniche.
4. In **Render** aggiungi fino a CINQUE elementi. Dentro ciascuno carica/scegli una foto, poi aggiungi didascalia e descrizione accessibile. Disponili nell'ordine desiderato. Puoi eliminare gli spazi vuoti degli esempi.
5. Compila **Construction notes**: Fit, Collar/Neckline, Pockets, Seams and topstitching, Fabric, Volume.
6. Carica la foto in **Physical reference / Sketch**.
7. In **Viewer 3D** carica il GLB. Usa un nome diverso per ogni modello per non sovrascrivere un altro capo. In alternativa, inserisci il suo URL HTTPS esterno nel campo dedicato.
8. Scegli la **Posizione**: 10 appare prima di 20, poi 30. Puoi inserire 15 tra 10 e 20.
9. Per salvare senza mostrare il lavoro lascia **Bozza**. Per mostrarlo, scegli **Pubblicato** e premi **Save**.
10. Attendi che **Actions > Publish portfolio** finisca con il segno verde, poi aggiorna il sito.

Non devi caricare le stesse immagini anche su GitHub: Pages CMS le salva nella cartella giusta e scrive i collegamenti. Caricale DENTRO il campo del lavoro. Caricare un file soltanto nella libreria Media non lo assegna ancora a una galleria.

Le bozze non compaiono nel portfolio pubblicato. Il repository gratuito e pubblico: file originali, cronologia e immagini non sono riservati. Non caricare materiale confidenziale come bozza.

## 4. Crea o modifica una collezione

1. Apri **Collezioni > New entry / Add**.
2. Scrivi il nome, la posizione e lo stato **Pubblicato**, poi salva.
3. Nella scheda di un lavoro seleziona quella collezione.
4. Il sito crea da solo la nuova voce pervinca e riparte da 01 con la numerazione.
5. Per nascondere una collezione impostala come **Bozza**. Prima di eliminarla definitivamente, sposta o elimina i suoi lavori.

Per rimuovere un lavoro usa **Delete** nella sua scheda. Le immagini non piu usate possono restare nella libreria: cancellale solo se nessun altro lavoro le usa.

## 5. Le immagini da mandarmi adesso

Puoi allegarle qui con i nomi che hanno gia. Non devi caricarle prima su Cloudinary o GitHub.
Indica collezione, nome del lavoro, ordine dei render e quale foto e la reference. Allega anche il modello e i testi disponibili.
Organizzero e colleghero io i file. Finche il CMS non e collegato, il pacchetto aggiornato va caricato anche su GitHub. Un allegato in chat non arriva automaticamente sul tuo GitHub: non ho ancora quel collegamento. Dopo l'attivazione, userai direttamente i campi di Pages CMS.

## 6. Modelli e immagini pesanti

- GLB e il piu semplice: geometria e texture in un file. Punta a circa 5-15 MB quando la qualita lo consente.
- Il CMS carica i file ma NON ottimizza automaticamente una mesh o un GLB come facciamo in chat. Mandami prima i modelli molto pesanti.
- Restano i limiti del servizio di caricamento e di GitHub. Se un file viene rifiutato, usa una versione ottimizzata o il campo URL esterno HTTPS. Il primo upload reale va provato dopo il collegamento al tuo account.
- GLTF richiede anche TUTTI i BIN e le texture, con gli stessi nomi e sottocartelle richiesti dal modello. Il campo "File collegati" non ripara percorsi e non estrae ZIP. Se hai dubbi, mandami il pacchetto completo per convertirlo in GLB.
- Il sito adatta le immagini ai riquadri senza tagliare il capo. Il CMS non esegue ritagli fotografici precisi: puoi chiedermeli qui.

## 7. Prima prova e problemi

Prima prova: crea una bozza con una foto; verifica che non compaia. Impostala Pubblicato, salva e attendi il segno verde in Actions. Controlla la galleria, poi prova un piccolo GLB. Questa prova conferma il collegamento reale al tuo account e i caricamenti.

Se qualcosa non appare: controlla che lavoro E collezione siano Pubblicato, che Pages CMS usi main e che il workflow sia verde. Un errore di costruzione lascia online la precedente versione funzionante. Mandami il messaggio o una schermata, senza password, codici o chiavi.
