# Radar — installation (environ 20 minutes, une seule fois)

Deux applis, les mêmes fiches :

- **Radar Poste** (`pc.html`) pour la prospection téléphonique sur PC.
- **Radar Terrain** (`mobile.html`) pour la prospection terrain sur téléphone, avec le GPS et la recherche à 50 m.

Elles fonctionnent hors ligne. Les fiches se synchronisent dès qu'il y a du réseau, et chaque commercial a son propre compte et ses propres fiches.

---

## Étape 1 — La base de données (Supabase, gratuit)

1. Va sur **supabase.com**, puis « Start your project ». Crée un compte (Google ou GitHub, c'est le plus rapide).
2. **New project** :
   - Nom : `radar`.
   - Mot de passe de base : génère-le et garde-le.
   - Région : **Europe West (Paris)**. Les données restent en France.
3. Attends 1 à 2 minutes que le projet soit prêt.
4. Menu de gauche : **SQL Editor**, puis « New query ». Colle tout le contenu du fichier `supabase.sql` et clique **Run**. Tu dois voir « Success ».
5. Menu **Project Settings → API**. Copie deux valeurs :
   - **Project URL** (du type `https://abcd.supabase.co`) ;
   - la clé **anon public** (longue chaîne qui commence par `eyJ…`).
6. Ouvre le fichier `config.js` avec le Bloc-notes et colle les deux valeurs entre les guillemets :
   ```js
   supabaseUrl: "https://abcd.supabase.co",
   supabaseAnonKey: "eyJ...",
   ```
   La clé « anon » est faite pour être publique. La sécurité vient des règles de la base : chacun ne voit que ses fiches.

## Étape 2 — Mettre les applis en ligne (GitHub Pages, gratuit)

1. Va sur **github.com** et crée un compte.
2. **New repository** :
   - Nom : `radar`.
   - Visibilité : **Public**. C'est obligatoire pour GitHub Pages gratuit, et sans risque : aucune fiche n'est dans le code.
   - Clique « Create ».
3. Clique « uploading an existing file ». Glisse **tout le contenu** du dossier, puis « Commit changes ».
4. Ouvre **Settings → Pages**. Dans « Branch », choisis `main` et `/ (root)`, puis **Save**.
5. Attends 1 à 2 minutes. Ton adresse s'affiche : `https://TON-PSEUDO.github.io/radar/`.

## Étape 3 — Relier la connexion à ton adresse

Dans Supabase, ouvre **Authentication → URL Configuration** :

- **Site URL** : `https://TON-PSEUDO.github.io/radar/`
- **Redirect URLs** : ajoute `https://TON-PSEUDO.github.io/radar/*`

Ce réglage permet aux liens « confirmer mon email » et « mot de passe oublié » de ramener dans l'appli.

Pour aller plus vite : dans **Authentication → Sign In / Providers → Email**, décoche « Confirm email ». Les commerciaux se connectent alors dès la création de leur compte.

## Étape 4 — Installer les applis

- **Téléphone (Radar Terrain)** : ouvre `https://TON-PSEUDO.github.io/radar/mobile.html`.
  - iPhone : dans **Safari**, touche Partager, puis « Sur l'écran d'accueil ».
  - Android : dans **Chrome**, menu ⋮, puis « Installer l'application ».
  - Au premier « Me localiser », **accepte la localisation**.
- **PC (Radar Poste)** : ouvre `https://TON-PSEUDO.github.io/radar/pc.html` dans **Chrome ou Edge**. Clique l'icône d'installation à droite de la barre d'adresse, ou le bouton « Installer » dans l'appli.
- Crée ton compte dans une des deux applis, puis connecte-toi avec les **mêmes identifiants** dans l'autre.

## Étape 5 — L'équipe

Envoie l'adresse `https://TON-PSEUDO.github.io/radar/` à chaque commercial. La page d'accueil propose la bonne appli selon l'appareil. Chacun crée son compte et ne voit que ses fiches.

Quand toute l'équipe est inscrite, tu peux fermer les inscriptions : **Authentication → Sign In / Providers**, décoche « Allow new users to sign up ».

---

## Bon à savoir

- **Recherche autour de moi** : elle utilise le registre officiel des entreprises (INSEE / RNE, service public gratuit). Elle trouve aussi les cabinets à l'étage que les cartes ne montrent pas.
  - Les holdings et SCI sont masquées.
  - Les banques et pharmacies sont décochées.
  - Les adresses du registre peuvent dater : vérifie sur place.
- **Identification** : le registre ne contient pas de numéros de téléphone. Un numéro saisi est enregistré, mais ne permet pas de retrouver l'entreprise.
- **Hors ligne** : tout est gardé sur l'appareil et part à la synchro au retour du réseau. Le point en haut à droite indique l'état (vert = synchronisé).
- **Supabase gratuit** : un projet sans aucune activité pendant 7 jours est mis en pause. Il se réactive en un clic depuis supabase.com. Avec une utilisation quotidienne, ça n'arrive pas.
- **Mises à jour** : remplace les fichiers sur GitHub (même méthode qu'à l'étape 2). Pour forcer le rafraîchissement chez tout le monde, change `radar-v1` en `radar-v2` dans `sw.js`.
- **Sauvegarde** : menu « ••• », puis « Télécharger une sauvegarde complète » (fichier .json réimportable). Il y a aussi l'export CSV pour Artis ou Excel.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'accueil : choix et installation des applis |
| `pc.html` | Radar Poste (PC) |
| `mobile.html` | Radar Terrain (téléphone) |
| `app.js`, `app.css` | Le moteur et le design, communs aux deux applis |
| `config.js` | Tes 2 clés Supabase |
| `supabase.sql` | Création de la base (à exécuter une fois) |
| `sw.js`, `*.webmanifest`, `` | Installation et fonctionnement hors ligne |
