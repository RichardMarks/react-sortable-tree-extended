import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
// import '../../src/react-sortable-tree/src/utils'
import './index.css'

const type = 'NEW_NODE'

const dragSpec = {
  beginDrag(props,monitor) {
    const treeData = props.getTreeData()
    // treeData.pop()
    const updateTreeData = props.updateTreeData
    const getNearestNode = () => {}
    return {
      treeData,
      DUMMY: 'HELLO THERE???',
      updateTreeData
      // draggedNode: treeData[0],
      // getNearestNode
    }
  },

  isDragging(props,monitor) {
    // console.log('isDragging')
    monitor.getItem()
  },
  endDrag(props, monitor) {
    // debugger
  }

}

function dragCollect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  }
}
class ExternalNode extends Component {
  render () {
    return this.props.connectDragPreview(
      <div className='externalNode'>
        ExternalNode
        {this.props.connectDragSource(<div>DRAG</div>)}
      </div>
    )
  }
}

export default DragSource(type,dragSpec,dragCollect)(ExternalNode)