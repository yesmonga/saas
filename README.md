# ResellHub - Gestion de Stock pour Achat-Revente

Application SaaS complète de gestion de stock pour l'activité d'achat-revente (Pokémon, Collectibles, Sneakers, Figurines, Vêtements).

## Fonctionnalités

- **Dashboard** - KPIs en temps réel, graphiques de ventes, alertes
- **Inventaire** - Vue grille/liste, filtres avancés, recherche
- **Gestion produits** - CRUD complet avec calcul de marge automatique
- **Ventes** - Historique, enregistrement avec calcul de bénéfice net
- **Analytics** - Graphiques avancés, performance par catégorie, ROI
- **Amazon Orders** - Suivi des commandes, comptes bannis
- **Import Notion** - Import automatique des fichiers .md et .csv
- **Dark mode** - Interface moderne et élégante

## Stack Technique

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **UI**: shadcn/ui, Lucide Icons, Recharts
- **Backend**: Next.js API Routes
- **Database**: SQLite avec Prisma ORM
- **State**: Zustand

## Installation

```bash
# Cloner le repo
git clone https://github.com/yesmonga/saas.git
cd resellhub

# Installer les dépendances
npm install

# Configurer la base de données
npx prisma migrate dev

# Lancer en développement
npm run dev
```

## Import des données Notion

1. Placez votre dossier `Notion` exporté dans le dossier parent du projet
2. Cliquez sur "Importer Notion" dans le Dashboard
3. Les fichiers `.md` et `.csv` seront automatiquement parsés

## Structure du projet

```
/src
  /app                 # Pages Next.js (App Router)
    /api               # Routes API
    /inventory         # Page inventaire
    /add               # Ajout produit
    /edit/[id]         # Édition produit
    /sales             # Ventes
    /analytics         # Analytics
    /amazon            # Commandes Amazon
    /settings          # Paramètres
  /components
    /ui                # Composants shadcn/ui
    /layout            # Sidebar, Header
    /dashboard         # Composants dashboard
  /lib                 # Utilitaires, Prisma client
  /types               # Types TypeScript
  /data                # Données statiques
/prisma                # Schema et migrations
```

## Déploiement

### Vercel (Recommandé)

```bash
npm run build
# Déployer sur Vercel
```

### Netlify

```bash
npm run build
# Déployer le dossier .next
```

## Configuration

Variables d'environnement (`.env`):

```env
DATABASE_URL="file:./dev.db"
```

## Catégories par défaut

- Pokemon
- Pop Mart
- Sneakers
- Figurines & Collectibles
- Vêtements
- Vinyles & Musique
- Jouets & Poupées
- Trading Cards
- Accessoires
- Mattel
- Lorcana
- Autres

## Auteur

**Alex** - [Profil Vinted](https://www.vinted.fr/member/14582133)

## License

MIT
