import { useEffect, useRef, useState } from 'react'
import './Field.css'
import { useOnClickOutside } from './hooks/useOutsideClick'

export function Field() {
  const [nodes, setNodes] = useState([])
  const [editor, setEditor] = useState(null)

  return (
    <div
      className="Field"
      onDoubleClick={(event) => setEditor({ x: event.pageX, y: event.pageY })}
    >
      <div>
        {nodes.map((node) => (
          <Node {...node} />
        ))}
      </div>
      {editor && (
        <Editor
          position={editor}
          closeEditor={() => setEditor(null)}
          addNode={(node) => setNodes((nodes) => [...nodes, node])}
        />
      )}
    </div>
  )
}

function Editor(props) {
  const [text, setText] = useState('')

  const inputRef = useRef(null)

  useOnClickOutside(inputRef, () => {
    if (!text) props.closeEditor()
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (text) props.addNode({ content: text, position: props.position })

    props.closeEditor()
  }

  return (
    <div
      className="Field-Editor"
      style={{ top: props.position.y, left: props.position.x }}
    >
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
        />
      </form>
    </div>
  )
}

export function Node(props) {
  return (
    <div
      className="Field-Node"
      style={{ top: props.position.y, left: props.position.x }}
      disabled
    >
      {props.content}
    </div>
  )
}
