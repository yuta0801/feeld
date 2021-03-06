import { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { useOnClickOutside } from './hooks/useOutsideClick'
import './Field.css'

export function Field() {
  const feeldRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [editor, setEditor] = useState(null)

  return (
    <div
      className="Field"
      onDoubleClick={(event) => {
        if (event.target === feeldRef.current) {
          event.preventDefault()
          setEditor({ x: event.pageX, y: event.pageY })
        }
      }}
      ref={feeldRef}
    >
      <div>
        {nodes.map((node, index) => (
          <Node
            key={index}
            {...node}
            handleUpdate={(node) =>
              setNodes((nodes) => [
                ...nodes.filter((_, i) => i !== index),
                node,
              ])
            }
            handleAdd={(node) => setNodes((nodes) => [...nodes, node])}
          />
        ))}
      </div>
      {editor && (
        <Editor
          position={editor}
          handleClose={() => setEditor(null)}
          handleSubmit={(node) =>
            setNodes((nodes) => [...nodes, { ...node, created: true }])
          }
        />
      )}
    </div>
  )
}

function Editor(props) {
  const [text, setText] = useState(props.defaultValue ?? '')

  const inputRef = useRef(null)

  useOnClickOutside(inputRef, () => {
    if (!text || props.defaultValue) props.handleClose()
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (text) props.handleSubmit({ content: text, position: props.position })

    props.handleClose()
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
  const nodeRef = useRef(null)
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (props.created) nodeRef.current?.focus()
  }, [props])

  return (
    <>
      <Draggable>
        <div>
          {!editing ? (
            <div
              className="Field-Node"
              style={{ top: props.position.y, left: props.position.x }}
              onDoubleClick={() => setEditing(true)}
              tabIndex={0}
              onKeyPress={(e) => e.key === ' ' && setAdding(true)}
              ref={nodeRef}
            >
              <span className="content">{props.content}</span>
            </div>
          ) : (
            <Editor
              defaultValue={props.content}
              position={props.position}
              handleClose={() => setEditing(false)}
              handleSubmit={(node) => props.handleUpdate(node)}
            />
          )}
        </div>
      </Draggable>
      {adding && (
        <Editor
          position={{
            x: props.position.x,
            y: props.position.y + 16 + nodeRef.current?.offsetHeight ?? 0,
          }}
          handleClose={() => setAdding(false)}
          handleSubmit={(node) => props.handleAdd({ ...node, created: true })}
        />
      )}
    </>
  )
}
