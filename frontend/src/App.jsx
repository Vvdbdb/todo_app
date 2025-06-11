import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // États de l'application
  const [todos, setTodos] = useState([]); // Stocke la liste des tâches
  const [title, setTitle] = useState(''); // Stocke le titre de la tâche en cours de création/modification
  const [description, setDescription] = useState(''); // Stocke la description de la tâche
  const [editing, setEditing] = useState(null); // Stocke l'ID de la tâche en cours d'édition (null si création)
  const [showTasks, setShowTasks] = useState(false); // Contrôle l'affichage de la liste des tâches
  const [isLoading, setIsLoading] = useState(false); // Indicateur de chargement

  // Effet qui s'exécute lorsque showTasks change
  useEffect(() => {
    if (showTasks) {
      fetchTodos(); // Charge les tâches seulement si l'utilisateur a demandé à les voir
    }
  }, [showTasks]);

  /**
   * Récupère les tâches depuis l'API
   */
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/todos');
      setTodos(res.data); // Met à jour l'état avec les tâches reçues
    } catch (err) {
      console.error('Erreur lors du chargement des tâches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gère la soumission du formulaire (création et modification)
   * @param {Event} e - L'événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // Mode édition : requête PUT pour mettre à jour la tâche
        await axios.put(`/api/todos/${editing}`, { title, description });
        setEditing(null); // Quitte le mode édition
      } else {
        // Mode création : requête POST pour ajouter une nouvelle tâche
        await axios.post('/api/todos', { title, description });
      }
      // Réinitialise le formulaire
      setTitle('');
      setDescription('');
      // Recharge les tâches si elles sont visibles
      if (showTasks) fetchTodos();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  /**
   * Supprime une tâche
   * @param {string} id - L'ID de la tâche à supprimer
   */
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      fetchTodos(); // Recharge la liste après suppression
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  /**
   * Passe en mode édition pour une tâche spécifique
   * @param {Object} todo - La tâche à modifier
   */
  const startEdit = (todo) => {
    setTitle(todo.title); // Pré-remplit le champ titre
    setDescription(todo.description); // Pré-remplit le champ description
    setEditing(todo.id); // Active le mode édition
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* En-tête de l'application */}
        <h1 style={styles.header}>📝 Todo List</h1>

        {/* Section du formulaire - toujours visible */}
        <div style={styles.formContainer}>
          <h2 style={styles.sectionTitle}>
            {editing ? 'Modifier une tâche' : 'Ajouter une tâche'}
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Champ pour le titre de la tâche */}
            <input
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre"
              required
            />
            
            {/* Champ pour la description de la tâche */}
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            
            {/* Boutons du formulaire */}
            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.primaryButton}>
                {editing ? 'Sauvegarder' : 'Ajouter'}
              </button>
              {/* Affiche le bouton Annuler seulement en mode édition */}
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setTitle('');
                    setDescription('');
                  }}
                  style={styles.secondaryButton}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bouton pour afficher/masquer la liste des tâches */}
        <button
          onClick={() => setShowTasks(!showTasks)}
          style={styles.toggleButton}
        >
          {showTasks ? 'Masquer les tâches' : 'Consulter les tâches'}
        </button>

        {/* Section de la liste des tâches - visible seulement quand showTasks est true */}
        {showTasks && (
          <div style={styles.tasksContainer}>
            <h2 style={styles.sectionTitle}>Liste des tâches</h2>
            
            {/* État de chargement */}
            {isLoading ? (
              <p style={styles.loading}>Chargement...</p>
            ) : 
            
            /* État quand il n'y a pas de tâches */
            todos.length === 0 ? (
              <p style={styles.emptyMessage}>Aucune tâche à afficher</p>
            ) : 
            
            /* Affichage de la liste des tâches */
            (
              <ul style={styles.taskList}>
                {todos.map((todo) => (
                  <li key={todo.id} style={styles.taskItem}>
                    {/* Contenu de la tâche */}
                    <div style={styles.taskContent}>
                      <h3 style={styles.taskTitle}>{todo.title}</h3>
                      <p style={styles.taskDescription}>{todo.description}</p>
                    </div>
                    
                    {/* Boutons d'action pour la tâche */}
                    <div style={styles.taskActions}>
                      {/* Bouton Modifier - fond blanc avec icône */}
                      <button
                        onClick={() => startEdit(todo)}
                        style={styles.editButton}
                        title="Modifier cette tâche"
                      >
                        ✏️
                      </button>
                      
                      {/* Bouton Supprimer - fond blanc avec icône */}
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        style={styles.deleteButton}
                        title="Supprimer cette tâche"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles CSS-in-JS
const styles = {
  container: {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  header: {
    color: '#3f51b5',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2.2rem',
  },
  formContainer: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  sectionTitle: {
    color: '#3f51b5',
    marginTop: 0,
    marginBottom: '1.5rem',
    fontSize: '1.3rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.3s',
  },
  textarea: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical',
    outline: 'none',
    transition: 'border 0.3s',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  primaryButton: {
    backgroundColor: '#3f51b5',
    color: 'white',
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.3s',
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.3s',
    flex: 1,
  },
  toggleButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    width: '100%',
    marginBottom: '2rem',
    transition: 'background-color 0.3s',
  },
  tasksContainer: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  taskItem: {
    backgroundColor: 'white',
    padding: '1.2rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    margin: 0,
    color: '#333',
    fontSize: '1.1rem',
  },
  taskDescription: {
    margin: '0.5rem 0 0',
    color: '#666',
  },
  taskActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  // Style du bouton Modifier - fond blanc avec bordure
  editButton: {
    backgroundColor: 'white',
    color: '#ffc107',
    border: '1px solid #ffc107',
    borderRadius: '4px',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  // Style du bouton Supprimer - fond blanc avec bordure
  deleteButton: {
    backgroundColor: 'white',
    color: '#f44336',
    border: '1px solid #f44336',
    borderRadius: '4px',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    padding: '1rem',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    padding: '1rem',
  },
};

export default App;