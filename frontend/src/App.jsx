import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  // États du composant
  const [todos, setTodos] = useState([]); // Stocke la liste des tâches
  const [title, setTitle] = useState(""); // Stocke le titre de la tâche en cours de création/modification
  const [description, setDescription] = useState(""); // Stocke la description de la tâche
  const [editing, setEditing] = useState(null); // Stocke l'ID de la tâche en cours d'édition (null si mode création)

  // Effet qui s'exécute au chargement du composant
  useEffect(() => {
    fetchTodos(); // Charge les tâches existantes
  }, []);

  /**
   * Récupère les tâches depuis l'API backend
   */
  const fetchTodos = async () => {
    try {
      const res = await axios.get('/api/todos');
      setTodos(res.data); // Met à jour l'état avec les tâches reçues
    } catch (err) {
      console.error("Erreur de récupération:", err);
    }
  };

  /**
   * Gère la soumission du formulaire (AJOUT et MODIFICATION)
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    try {
      // MODE MODIFICATION
      if (editing) {
        // Envoie une requête PUT pour mettre à jour la tâche existante
        await axios.put(`/api/todos/${editing}`, { 
          title, 
          description 
        });
        setEditing(null); // Quitte le mode édition
      } 
      // MODE AJOUT
      else {
        // Envoie une requête POST pour créer une nouvelle tâche
        await axios.post('/api/todos', { 
          title, 
          description 
        });
      }
      
      // Réinitialise les champs et rafraîchit la liste
      setTitle("");
      setDescription("");
      fetchTodos(); // Recharge les tâches depuis le serveur
    } catch (err) {
      console.error("Erreur d'enregistrement:", err);
    }
  };

  /**
   * Passe en mode édition pour une tâche spécifique
   * @param {Object} todo - La tâche à modifier
   */
  const startEdit = (todo) => {
    setTitle(todo.title); // Pré-remplit le champ titre
    setDescription(todo.description); // Pré-remplit le champ description
    setEditing(todo.id); // Stocke l'ID de la tâche à modifier
  };

  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '700px',
        margin: '0 auto',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#1e88e5' }}>📝 Ma ToDo List</h1>
        
        {/* FORMULAIRE D'AJOUT/MODIFICATION */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Champ Titre */}
          <input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: '10px', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          
          {/* Champ Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '10px', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          
          {/* Bouton Soumettre - Change de libellé selon le mode */}
          <button 
            type="submit" 
            style={{
              backgroundColor: '#1e88e5',
              color: 'white',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {editing ? "Sauvegarder modifications" : "Ajouter une tâche"}
          </button>
        </form>

        {/* LISTE DES TÂCHES */}
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '2rem' }}>
          {todos.map(todo => (
            <li 
              key={todo.id} 
              style={{
                backgroundColor: '#e3f2fd',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                position: 'relative'
              }}
            >
              {/* Affichage de la tâche */}
              <strong style={{ fontSize: '1.1rem', color: '#1565c0' }}>{todo.title}</strong>
              <br />
              <small style={{ color: '#444' }}>{todo.description}</small>
              
              {/* BOUTON MODIFICATION - Visible pour chaque tâche */}
              <div style={{ 
                position: 'absolute', 
                right: '1rem', 
                top: '1rem'
              }}>
                <button 
                  onClick={() => startEdit(todo)}
                  style={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  <span>✏️</span>
                  <span>Modifier</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;