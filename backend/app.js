const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Récupérer toutes les tâches (nécessaire pour l'affichage)
app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos ORDER BY id DESC', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.rows);
  });
});

// Ajouter une tâche
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

// Modifier une tâche
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running at http://0.0.0.0:${PORT}`);
});