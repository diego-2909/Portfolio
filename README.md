# Portfolio — Diego Cortes

Site personnel en HTML, CSS et JavaScript, sans framework ni compilation. Il est publié avec GitHub Pages.

En ligne : https://diego-2909.github.io/Portfolio/

## Structure

```
index.html     la page (squelette)
styles.css     la mise en page
data.js        tout le contenu, en français et en anglais
app.js         le rendu, les interactions et les animations
assets/        photo, maquette RunMates, CV en PDF
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

## Animations

Les animations utilisent [GSAP](https://gsap.com) et ScrollTrigger, chargés depuis cdnjs.
Elles sont désactivées pour les visiteurs qui ont demandé à réduire les animations, et le site fonctionne normalement si GSAP ne se charge pas.

## Tester en local

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.
