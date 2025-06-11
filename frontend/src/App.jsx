import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Composant principal de l'application Todo List
 * Gère l'affichage et la manipulation des tâches
 */
const App = () => {
  // États de l'application
  const [todos, setTodos] = useState([]); // Liste des tâches
  const [title, setTitle] = useState(''); // Titre de la tâche en cours de création/modification
  const [description, setDescription] = useState(''); // Description de la tâche
  const [editing, setEditing] = useState(null); // ID de la tâche en édition (null si création)
  const [showTasks, setShowTasks] = useState(false); // Contrôle l'affichage de la liste
  const [isLoading, setIsLoading] = useState(false); // État de chargement

  /**
   * Effet qui s'exécute quand showTasks change
   * Charge les tâches si l'utilisateur demande à les voir
   */
  useEffect(() => {
    if (showTasks) fetchTodos();
  }, [showTasks]);

  /**
   * Récupère les tâches depuis l'API
   */
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des tâches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gère la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // Mode édition : requête PUT pour mise à jour
        await axios.put(`/api/todos/${editing}`, { title, description });
        setEditing(null); // Quitte le mode édition
      } else {
        // Mode création : requête POST pour nouvelle tâche
        await axios.post('/api/todos', { title, description });
      }
      // Réinitialisation du formulaire
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
   * @param {string} id - ID de la tâche à supprimer
   */
  const deleteTodo = async (id) => {
    // Confirmation avant suppression
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?');
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`/api/todos/${id}`);
      fetchTodos(); // Recharge la liste après suppression
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  /**
   * Active le mode édition pour une tâche
   * @param {Object} todo - Tâche à modifier
   */
  const startEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditing(todo.id);
  };

  // Rendu du composant
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* En-tête de l'application */}
        <h1 style={styles.header}>📝 Todo List</h1>

        {/* Section du formulaire */}
        <div style={styles.formContainer}>
          <h2 style={styles.sectionTitle}>
            {editing ? 'Modifier une tâche' : 'Ajouter une tâche'}
          </h2>

          {/* Formulaire de création/modification */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Champ pour le titre */}
            <input
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre"
              required
            />

            {/* Champ pour la description */}
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            {/* Groupe de boutons */}
            <div style={styles.buttonGroup}>
              {/* Bouton principal (Ajouter/Sauvegarder) */}
              <button type="submit" style={styles.primaryButton}>
                {editing ? 'Sauvegarder' : 'Ajouter'}
              </button>

              {/* Bouton Annuler (visible seulement en mode édition) */}
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

            {/* Bouton pour afficher/masquer la liste */}
            <button
              type="button"
              onClick={() => setShowTasks(!showTasks)}
              style={styles.fullWidthToggleButton}
            >
              {showTasks ? 'Masquer les tâches' : 'Consulter les tâches'}
            </button>
          </form>
        </div>

        {/* Section d'affichage des tâches (conditionnelle) */}
        {showTasks && (
          <div style={styles.tasksContainer}>
            <h2 style={styles.sectionTitle}>Liste des tâches</h2>
            
            {/* État de chargement */}
            {isLoading ? (
              <p style={styles.loading}>Chargement...</p>
            ) : 
            
            /* Message si aucune tâche */
            todos.length === 0 ? (
              <p style={styles.emptyMessage}>Aucune tâche à afficher</p>
            ) : 
            
            /* Liste des tâches */
            (
              <ul style={styles.taskList}>
                {todos.map((todo) => (
                  <li key={todo.id} style={styles.taskItem}>
                    {/* Contenu de la tâche */}
                    <div style={styles.taskContent}>
                      <h3 style={styles.taskTitle}>{todo.title}</h3>
                      <p style={styles.taskDescription}>{todo.description}</p>
                    </div>
                    
                    {/* Boutons d'action */}
                    <div style={styles.taskActions}>
                      {/* Bouton Modifier */}
                      <button
                        onClick={() => startEdit(todo)}
                        style={styles.editButton}
                        title="Modifier cette tâche"
                      >
                        ✏️
                      </button>
                      
                      {/* Bouton Supprimer */}
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

// Styles CSS-in-JS pour le composant
const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2.5rem',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)'
  },
  header: {
    color: '#3f51b5',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2.4rem',
    fontWeight: '600'
  },
  formContainer: {
    backgroundColor: '#fafafa',
    borderRadius: '10px',
    padding: '2rem',
    marginBottom: '2.5rem',
    border: '1px solid #eee',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
  },
  sectionTitle: {
    color: '#3f51b5',
    fontSize: '1.4rem',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  input: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.3s',
    '&:focus': {
      borderColor: '#3f51b5',
      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
    }
  },
  textarea: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    minHeight: '120px',
    resize: 'vertical',
    lineHeight: '1.6',
    outline: 'none',
    transition: 'border 0.3s',
    '&:focus': {
      borderColor: '#3f51b5',
      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
    }
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.5rem'
  },
  primaryButton: {
    backgroundColor: '#3f51b5',
    color: 'white',
    padding: '0.9rem 1.8rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s',
    flex: 1,
    '&:hover': {
      backgroundColor: '#303f9f'
    }
  },
  secondaryButton: {
    backgroundColor: '#f1f1f1',
    color: '#555',
    padding: '0.9rem 1.8rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s',
    flex: 1,
    '&:hover': {
      backgroundColor: '#e0e0e0'
    }
  },
  fullWidthToggleButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '0.9rem 1.8rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '0.5rem',
    transition: 'all 0.25s',
    '&:hover': {
      backgroundColor: '#388e3c'
    }
  },
  tasksContainer: {
    backgroundColor: '#fafafa',
    borderRadius: '10px',
    padding: '1.5rem',
    border: '1px solid #eee'
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  taskItem: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #3f51b5',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)'
    }
  },
  taskContent: {
    flex: 1,
    paddingRight: '1rem',
    overflow: 'hidden',
    wordBreak: 'break-word'
  },
  taskTitle: {
    color: '#333',
    fontSize: '1.2rem',
    margin: '0 0 0.5rem 0',
    fontWeight: '600',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  taskDescription: {
    color: '#666',
    margin: 0,
    lineHeight: '1.6',
    wordBreak: 'break-word'
  },
  taskActions: {
    display: 'flex',
    gap: '0.6rem'
  },
  editButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    color: '#ffc107',
    border: '1px solid #ffc107',
    borderRadius: '6px',
    padding: '0.7rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(255, 193, 7, 0.2)'
    }
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    color: '#f44336',
    border: '1px solid #f44336',
    borderRadius: '6px',
    padding: '0.7rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(244, 67, 54, 0.2)'
    }
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
    fontSize: '1.1rem'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    padding: '2rem',
    fontStyle: 'italic'
  }
};

export default App;