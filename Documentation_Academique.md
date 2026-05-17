# Étude Académique : V-Pitch (Plateforme de CV Vidéo & Portfolio SaaS)

## 1. Description Générale du Projet
**V-Pitch** est une plateforme sociale et professionnelle orientée SaaS, conçue pour permettre aux talents de se démarquer de manière interactive. Contrairement aux CV traditionnels en format papier ou PDF, V-Pitch met en avant l'identité visuelle et la personnalité des candidats via des **vidéos de présentation (Pitches)**, couplées à un **Portfolio dynamique** (projets, certifications, galeries de médias) et des **Feedbacks** (système de favoris/étoiles).

Le projet a été pensé en tant que prototype local first (Local-First Architecture), où l'intégralité des données est stockée et gérée directement dans le navigateur du client sans nécessiter d'infrastructure serveur externe coûteuse dans sa phase MVP.

---

## 2. Choix Technologiques & Stack (Front-End Local-First)
Afin de respecter la contrainte d'un déploiement sans backend externe ni Framework de rendu serveur (pas de Next.js, pas de backend Node/Express), la stack repose intégralement sur des technologies Front-End modernes et réactives :

- **Cœur applicatif :** React 18 (utilisé sans framework externe) avec TypeScript pour le typage strict.
- **Bundler & Build Tool :** Vite (remplace Webpack/Create-React-App pour une rapidité de compilation accrue).
- **Routage :** `react-router-dom` pour la navigation côté client (SPA - Single Page Application).
- **Base de Données Locale :** IndexedDB encapsulée via **Dexie.js**. Dexie permet des opérations asynchrones complexes (CRUD, stockage de blobs comme les vidéos et images) tout en garantissant la persistance des données même après la fermeture du navigateur.
- **Stylisation :** CSS natif avec variables CSS (Design System) et Flexbox/CSS Grid pour un design responsif.
- **Icônes & Logos :** `lucide-react` pour les icônes UI et **Devicon** (via CDN) pour l'affichage dynamique des logos de technologies de la stack (C++, Python, React, Flutter, Django, etc.).

---

## 3. Architecture du Projet (Structure des Fichiers)

L'architecture suit une logique modulaire classique React :

```
plateforme-cv/
├── index.html                  # Point d'entrée HTML, import du CDN Devicon
├── vite.config.ts              # Configuration Vite (Réseau local activé: host '0.0.0.0')
├── package.json                # Dépendances du projet
└── src/
    ├── main.tsx                # Initialisation de React et du Router
    ├── App.tsx                 # Layout principal (Sidebar, Topbar, Routage)
    ├── App.css                 # Fichier de styles global (variables, feed, portfolio)
    ├── types/
    │   └── cv.ts               # Définitions TypeScript (Interfaces: Profile, Experience, etc.)
    ├── services/
    │   └── cvService.ts        # Classe Dexie et fonctions CRUD (IndexedDB)
    ├── contexts/
    │   └── AuthContext.tsx     # Gestion d'état global de l'utilisateur (Login/Logout)
    ├── components/
    │   ├── Sidebar.tsx         # Barre de navigation latérale
    │   ├── SkillTags.tsx       # Composants d'affichage des badges de compétences
    │   └── VideoUpload.tsx     # Composant gérant l'upload du Pitch Vidéo
    └── pages/
        ├── Auth.tsx            # Page de connexion et de création automatique de profil
        ├── TalentDirectory.tsx # Fil d'actualité (Feed) et Annuaire en Grille
        ├── EditProfile.tsx     # Formulaire complexe de gestion du profil, imports JSON
        └── ProfilePreview.tsx  # Affichage public d'un CV avec Vidéo et Portfolio
```

---

## 4. Fonctionnalités Implémentées

### A. Authentification Simulée & Auto-génération
- **Authentification Locale :** Gérée via `localStorage`.
- Si un utilisateur se connecte avec un nom qui n'existe pas dans la base IndexedDB, l'application intercepte la connexion et **génère automatiquement un profil vierge** dans la base de données, en lui assignant un `userId`.

### B. Fil d'Actualité (Home Feed) & Annuaire (Directory)
- **Home Feed :** Présente tous les talents sous forme de cartes sociales compactes. La vidéo de présentation, si disponible, est intégrée à la carte sous forme de couverture sombre cliquable pour une immersion directe.
- **Talent Directory :** Vue en grille avec des filtres dynamiques multicritères (Trier par les plus récents, nombre d'étoiles, plus de 3 étoiles, nombre de compétences).

### C. Le Portfolio Interactif
- La page `ProfilePreview` dispose d'onglets (Resume / Portfolio).
- **Tech Stack :** Lecture automatique des compétences (`skills`). Si la compétence correspond à un mot clé connu (ex: React, C#, Django), le vrai logo s'affiche grâce au CDN Devicon.
- **Galerie Médias :** Intégration des Posts textes, images et vidéos.
- **Projets & Certifications :** Affichage sous forme de grilles de type carte. Les certifications supportent l'upload d'images ou de PDF (téléchargeables depuis la prévisualisation).

### D. Gestion de Fichiers Locaux (Blobs)
- Contrairement aux textes simples, les vidéos de présentation, photos de profil et pièces jointes des certifications sont stockées sous format `Blob` dans IndexedDB. L'application utilise `URL.createObjectURL()` à la volée pour les rendre lisibles par le navigateur, tout en gérant le cycle de vie de l'objet (révocation de l'URL à la destruction du composant pour éviter les fuites de mémoire).

### E. Importation JSON
- Un parseur JSON a été inclus dans `EditProfile`. Un utilisateur peut sélectionner un fichier `.json` depuis son ordinateur, qui est validé puis injecté dans l'état du formulaire local pour une mise à jour instantanée du CV.

---

## 5. Perspectives & Évolutions Académiques
Si ce projet venait à évoluer vers une véritable application déployée, voici les transitions recommandées :
1. **Migration IndexedDB vers PostgreSQL/MongoDB :** IndexedDB est localisé par navigateur. Pour une accessibilité cross-device, la classe `cvService.ts` devrait être réécrite pour faire des appels API `fetch` vers un backend (Node.js/Express ou Python/FastAPI).
2. **Stockage Cloud :** Les objets `Blob` très lourds (Vidéos) devront être envoyés vers un stockage Cloud natif tel que Amazon S3 ou Google Cloud Storage, et remplacés par des `urls` string dans la base de données.
3. **Véritable système d'Auth :** Remplacer le système simulé par du JWT (JSON Web Tokens) ou OAuth2.
