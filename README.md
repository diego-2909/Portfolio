# Portfolio — Diego Cortes

Site personnel en HTML, CSS et JavaScript, sans framework ni compilation. Il est publié sur Vercel.

En ligne : https://diego-cortes.dev/

## Structure

```
index.html     la page (squelette)
styles.css     la mise en page
data.js        tout le contenu, en français et en anglais
app.js         le rendu, les interactions, les animations et le suivi des liens
config.js      connexion Supabase (URL et clé publique)
admin/         page privée des liens de candidature
supabase/      schéma de la base (schema.sql)
assets/        photo, logos, maquette RunMates, image de partage, CV en PDF
```

## Modifier le contenu

Tous les textes sont dans `data.js` : présentation, projets, expériences, compétences, formation.
Chaque texte existe en deux versions, `L('texte français', 'english text')`.

- **Ajouter un projet** : copier un bloc `{ id: ..., year: ..., ... }` dans la liste `data` et l'adapter.
- **Ajouter un lien** (LinkedIn, appli RunMates…) : renseigner `linkedin` en haut de `app.js`, ou `links` sur le projet.
- **Changer le CV** : remplacer `assets/CV-Diego-Cortes.pdf`.

Un champ laissé vide n'est pas affiché.

### Présenter les projets Airbus

Les trois projets de la partie Expérience Airbus ont un bouton « Aperçu › ».
Leur contenu est dans `data.js` : le projet `airbus` (recertification, déjà rempli),
et les projets `airbus-gdocs` et `airbus-windows`, à compléter.
Pour chacun, renseigner `context` (le besoin), `approach` (une liste de ce que tu as fait)
et `result` (le résultat), en français et en anglais : `L('…', '…')`.

### Image de partage

`assets/og.jpg` (1200 × 630) s'affiche quand le lien est partagé sur LinkedIn, WhatsApp, Slack ou par mail.
Après un changement, LinkedIn garde l'ancienne image en cache : la rafraîchir avec
https://www.linkedin.com/post-inspector/

## Liens uniques par recruteur (Supabase)

Chaque candidature reçoit son propre lien, par exemple `https://diego-cortes.dev/?r=k7f3x9ab`.
Quand il est ouvert, le site enregistre l'ouverture, les aperçus de projets consultés,
le téléchargement du CV et le passage en anglais. Aucune adresse IP, aucun cookie.

### Mise en place (une seule fois)

1. **Créer le projet** sur [supabase.com](https://supabase.com) → New project (offre gratuite).
2. **Créer les tables** : SQL Editor → New query → coller `supabase/schema.sql` → Run.
   L'adresse administrateur est `d.cortes@me.com` : la changer dans le script si besoin.
3. **Créer ton compte admin** : Authentication → Users → Add user → Create new user,
   avec `d.cortes@me.com` et un mot de passe, en cochant « Auto Confirm User ».
4. **Fermer les inscriptions** : Authentication → Sign In / Providers → Email →
   désactiver « Allow new users to sign up ».
5. **Brancher le site** : Project Settings → API → copier « Project URL » et la clé
   « anon public » dans `config.js`. Jamais la clé `service_role`.

### Utilisation

- Ouvrir **https://diego-cortes.dev/admin/** et se connecter.
- Saisir l'entreprise (et une note si besoin), cliquer sur « Générer le lien », puis « Copier le lien ».
- Coller ce lien dans la candidature. Le tableau « Suivi » indique ensuite si le lien a été ouvert,
  combien de fois, quand, et ce qui a été consulté.

Les liens sont stockés dans Supabase, indépendamment du code : redéployer le site ne les casse pas,
tant que le paramètre `?r=` est conservé dans `app.js`.

## Animations

Les animations utilisent [GSAP](https://gsap.com) et ScrollTrigger, chargés depuis cdnjs.
Elles sont désactivées pour les visiteurs qui ont demandé à réduire les animations, et le site fonctionne normalement si GSAP ne se charge pas.

## Tester en local

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.
