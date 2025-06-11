const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Autorise les requêtes cross-origin
app.use(bodyParser.json()); // Permet de parser le JSON des requêtes

// ROUTES //

/**
 * Récupère toutes les tâches (triées par ID décroissant)
 * GET /api/todos
 */
app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos ORDER BY id DESC', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.rows);
  });
});

/**
 * Récupère une tâche spécifique par son ID
 * GET /api/todos/:id
 */
app.get('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM todos WHERE id = $1', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    res.json(result.rows[0]);
  });
});

/**
 * Ajoute une nouvelle tâche
 * POST /api/todos
 
 */
app.post('/api/todos', (req, res) => {
  const { title, description } = req.body;
  db.query(
    'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
    [title, description],
    (err, result) => {
      if (err) {
        console.error("Erreur d'insertion :", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("Tâche ajoutée :", result.rows[0]);
      res.status(201).json(result.rows[0]);
    }
  );
});

/**
 * Supprime une tâche par son ID
 * DELETE /api/todos/:id
 */
app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM todos WHERE id = $1', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send(); // 204 No Content pour une suppression réussie
  });
});

/**
 * Modifie une tâche existante par son ID
 * PUT /api/todos/:id
 */
app.put('/api/todos/:id', (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  db.query(
    'UPDATE todos SET title = $1, description = $2 WHERE id = $3 RETURNING *',
    [title, description, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result.rows[0]);
    }
  );
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
//app.listen(PORT, '0.0.0.0', () => {
 // console.log(`Backend running at http://0.0.0.0:${PORT}`);
//});