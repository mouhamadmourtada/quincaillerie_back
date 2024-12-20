require('dotenv').config();
const app = require('./src/app');
const { sequelize, syncDatabase } = require('./src/models');

// Test de la connexion à la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connection to database has been established successfully.');
        // Synchroniser la structure de la base de données
        return syncDatabase();
    })
    .then(() => {
        const PORT = process.env.PORT || 3005;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });
