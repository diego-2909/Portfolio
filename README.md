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

## Animations

Les animations utilisent [GSAP](https://gsap.com) et ScrollTrigger, chargés depuis cdnjs.
Elles sont désactivées pour les visiteurs qui ont demandé à réduire les animations, et le site fonctionne normalement si GSAP ne se charge pas.

## Tester en local

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.
