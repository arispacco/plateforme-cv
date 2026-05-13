# V-Pitch (plateforme-cv)

V-Pitch est une plateforme **local-first** pour créer, éditer et prévisualiser un CV/portfolio.  
L'application est construite avec **React + TypeScript** et stocke les données candidat dans **IndexedDB** via **Dexie**.

## Pourquoi ce projet ?

Ce projet vise à proposer une base simple et moderne pour :

- gérer un profil candidat en local ;
- structurer les expériences professionnelles ;
- ajouter une vidéo de présentation (V-Pitch) ;
- prévisualiser rapidement le rendu du profil.

## Fonctionnalités actuelles

- Édition d'un profil (nom, poste, compétences) ;
- Gestion d'une liste d'expériences ;
- Upload local d'une vidéo de présentation ;
- Sauvegarde locale dans le navigateur (IndexedDB) ;
- Vue de prévisualisation du profil.

## Stack technique

- React 18
- TypeScript
- Vite
- React Router
- Dexie (IndexedDB)
- ESLint

## Démarrage rapide

### Prérequis

- Node.js 20+ recommandé
- npm

### Installation

```bash
npm ci
```

### Lancer en développement

```bash
npm run dev
```

## Scripts disponibles

- `npm run dev` — démarre le serveur local
- `npm run lint` — lance ESLint
- `npm run build` — type-check et build de production
- `npm run preview` — prévisualise le build de production

## Notes d'architecture

- `src/types/cv.ts` contient les interfaces source-of-truth `Experience` et `CandidateProfile`.
- `src/services/cvService.ts` est la couche unique de persistance Dexie.
- `src/hooks/useCVSync.ts` est le hook de synchronisation UI utilisé par les composants.
- Les composants UI n'accèdent jamais directement à Dexie.

## Contribution (Open Source)

Les contributions sont bienvenues 🎉

1. Forkez le dépôt
2. Créez une branche (`feature/ma-feature`)
3. Faites vos changements
4. Vérifiez avec `npm run lint` et `npm run build`
5. Ouvrez une Pull Request claire et descriptive

## Roadmap (idées)

- Export du profil (PDF / JSON)
- Templates de CV
- Validation avancée du formulaire
- Synchronisation cloud optionnelle

## Licence

Aucune licence n'est encore définie dans ce dépôt.  
Si vous souhaitez l'ouvrir davantage à la communauté, ajoutez un fichier `LICENSE` (ex: MIT).
