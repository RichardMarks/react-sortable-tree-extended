import React, { Component } from 'react'
import { DragSource } from 'react-dnd'

const type = 'NEW_NODE'

const dragSpec = {
  beginDrag(props,monitor) {

    return {
      ...props
    }
  }

}

function dragCollect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}
class ExternalNode extends Component {
  render () {
    return this.props.connectDragSource(
      <div style={{border: '1px solid black', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '70px',
      backgroundColor:'lightgreen'}}>
        ExternalNODE
      </div>
    )
  }
}

export default DragSource(type,dragSpec,dragCollect)(ExternalNode)