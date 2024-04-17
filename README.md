## Getting Started

### Install NVM

```zsh
brew install nvm
```

You should create NVM's working directory if it doesn't exist
```zsh
mkdir ~/.nvm
```

Add the following to your shell profile e.g. ~/.profile or ~/.zshrc:
```zsh
  export NVM_DIR="$HOME/.nvm"
    [ -s "$HOMEBREW_PREFIX/opt/nvm/nvm.sh" ] && \. "$HOMEBREW_PREFIX/opt/nvm/nvm.sh" # This loads nvm
    [ -s "$HOMEBREW_PREFIX/opt/nvm/etc/bash_completion.d/nvm" ] && \. "$HOMEBREW_PREFIX/opt/nvm/etc/bash_completion.d/nvm" # This loads nvm bash_completion
```

### Install and use Node version defined in .nvmrc
```zsh
nvm use
```

### Install Npm packages
```zsh
npm install
```

### Update ENV Variables
Create .env file in the root of directory and add the following environment variable
```zsh
DATABASE_URL="file:./dev.db"
```

### IMPORTANT: Initialize SqlLite with Prisma and Seed the DB (In order for Application to have data to work with)
```zsh
 npx prisma migrate dev --name LinkedInClone
```

### Start the Dev Server
```zsh
npm run dev
```

1. `npm install` to install dependencies
2. `npm run dev` to run your app with hot reloading
3. `npm run build && npm run start` to compile and run a production build

## Helpful Commands

### Database

- `npx prisma migrate dev --name <migration_name>` - to set up the DB and automatically run the seed script
- `npm run seed` - execute the seed script (found at `./prisma/seed.ts`) to add data to your DB.
- `npm run generate` - make sure the Prisma client is up to date with your DB
