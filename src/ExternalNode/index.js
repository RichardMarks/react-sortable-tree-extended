import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import { memoizedInsertNode } from '../../src/react-sortable-tree/src/utils/memoized-tree-data-utils'
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
      updateTreeData,
      externalIsOver: monitor.isDragging(),
      // draggedNode: treeData[0],
      // getNearestNode
    }
  },

  isDragging(props,monitor) {
    // console.log('isDragging')
    // monitor.getItem()
    // console.log('getDropResult:',monitor.getDropResult())
    return true
  },
  endDrag(props, monitor) {
    // console.log(props)
    const {
      path,
      node,
      depth,
      treeIndex,
      treeData
    } = monitor.getDropResult()

    // insert node now and update tree
    const newFromExternalTree = memoizedInsertNode({
      treeData,
      depth: depth,
      minimumTreeIndex: treeIndex,
      expandParent: true,
      getNodeKey: (treeIndex) => treeIndex,
      newNode: node
    }).treeData
    props.updateTreeData(newFromExternalTree)
    // console.log('didDrop', monitor.didDrop())    
    // monitor.didDrop() && props.updateTreeData
    // console.log('item insided endDrag:', monitor.getItem())
    // debugger
  }

}

function dragCollect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    didDrop: monitor.didDrop(),

  }
}
class ExternalNode extends Component {

  render () {
    // console.log('render()',this.props)
    return this.props.connectDragPreview(
      <div className={this.props.isDragging ? 'dragging' :'externalNode'}>
        External Node
        {this.props.connectDragSource(<div className='externalNode-handle'/>)}
      </div>
    )
  }
}

export default DragSource(type,dragSpec,dragCollect)(ExternalNode)