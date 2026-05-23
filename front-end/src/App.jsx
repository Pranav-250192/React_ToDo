import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function App() {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [edgeResult, setEdgeResult] = useState(null)
  const [edgeLoading, setEdgeLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    setFetching(true)
    setError(null)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setNotes(data)
    setFetching(false)
  }

  async function addNote(e) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.from('notes').insert([{ content: content.trim() }])
    if (error) setError(error.message)
    else {
      setContent('')
      await fetchNotes()
    }
    setLoading(false)
  }

  async function deleteNote(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) setError(error.message)
    else setNotes(notes.filter(n => n.id !== id))
  }

  async function testEdgeFunction() {
    setEdgeLoading(true)
    setEdgeResult(null)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/hello`, {
        headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      })
      const data = await res.json()
      setEdgeResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setEdgeResult('Error: ' + err.message)
    }
    setEdgeLoading(false)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📝</span>
            <h1>Notes App</h1>
          </div>
          <span className="badge">Supabase + React</span>
        </div>
      </header>

      <main className="main">
        {/* Add Note */}
        <section className="card">
          <h2>Add a Note</h2>
          <form onSubmit={addNote} className="form">
            <textarea
              id="note-input"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write something..."
              rows={3}
              disabled={loading}
            />
            <button id="add-note-btn" type="submit" disabled={loading || !content.trim()} className="btn btn-primary">
              {loading ? <span className="spinner" /> : '+ Add Note'}
            </button>
          </form>
          {error && <p className="error-msg">⚠️ {error}</p>}
        </section>

        {/* Notes List */}
        <section className="card">
          <div className="section-header">
            <h2>Your Notes</h2>
            <button id="refresh-btn" onClick={fetchNotes} className="btn btn-ghost" disabled={fetching}>
              {fetching ? '...' : '↻ Refresh'}
            </button>
          </div>

          {fetching ? (
            <div className="loading-state">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <span>🗒️</span>
              <p>No notes yet. Add your first one!</p>
            </div>
          ) : (
            <ul className="notes-list">
              {notes.map(note => (
                <li key={note.id} className="note-item">
                  <div className="note-content">{note.content}</div>
                  <div className="note-footer">
                    <span className="note-date">
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                    <button
                      id={`delete-note-${note.id}`}
                      onClick={() => deleteNote(note.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Edge Function Test */}
        <section className="card edge-card">
          <h2>Test Edge Function</h2>
          <p className="edge-desc">Click below to call the <code>/hello</code> Edge Function deployed on Supabase.</p>
          <button id="test-edge-btn" onClick={testEdgeFunction} disabled={edgeLoading} className="btn btn-secondary">
            {edgeLoading ? <span className="spinner" /> : '⚡ Call Edge Function'}
          </button>
          {edgeResult && (
            <pre className="edge-result">{edgeResult}</pre>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Built with React + Supabase · Deployed on Coolify</p>
      </footer>
    </div>
  )
}
