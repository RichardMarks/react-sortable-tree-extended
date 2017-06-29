import {
  DragDropContext as dragDropContext,
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { getDepth } from './tree-data-utils';
import { memoizedInsertNode } from './memoized-tree-data-utils';
// import { insertNode } from './tree-data-utils';

const nodeDragSource = {
  beginDrag(props) {
    props.startDrag(props); // <-- get nearest node here, and so return corresponding data as to break the API as little as possible

    return {
      node: props.node,
      parentNode: props.parentNode,
      path: props.path,
      treeIndex: props.treeIndex,
    };
  },

  endDrag(props, monitor) {
    props.endDrag(monitor.getDropResult());
  },

  isDragging(props, monitor) {
    const dropTargetNode = monitor.getItem().node;// || monitor.getItem().nearestNode; <- idea
    const draggedNode = props.node;

    return draggedNode === dropTargetNode;
  },
};

function getTargetDepth(dropTargetProps, monitor) {
  let dropTargetDepth = 0;
  const draggedItem = dropTargetProps//monitor.getItem();
  const rowAbove = dropTargetProps.getPrevRow();
  if (rowAbove) {
    // Limit the length of the path to the deepest possible
    dropTargetDepth = Math.min(
      rowAbove.path.length,
      dropTargetProps.path.length
    );
  }

  // const blocksOffset = 0//Math.round(
  // //   monitor.getDifferenceFromInitialOffset().x /
  // //     dropTargetProps.scaffoldBlockPxWidth
  // // );
    const blocksOffset = Math.round(
    monitor.getDifferenceFromInitialOffset().x /
      dropTargetProps.scaffoldBlockPxWidth
  );

  let targetDepth = Math.min(
    dropTargetDepth,
    Math.max(0, draggedItem.path.length + blocksOffset - 1)
  );

  // If a maxDepth is defined, constrain the target depth
  if (
    typeof dropTargetProps.maxDepth !== 'undefined' &&
    dropTargetProps.maxDepth !== null
  ) {
    const draggedNode = dropTargetProps.node//monitor.getItem().node;
    const draggedChildDepth = getDepth(draggedNode);

    targetDepth = Math.min(
      targetDepth,
      dropTargetProps.maxDepth - draggedChildDepth - 1
    );
  }

  return targetDepth;
}

function canDrop(dropTargetProps, monitor) {
  if (!monitor.isOver()) {
    return false;
  }

  const rowAbove = dropTargetProps.getPrevRow();
  const abovePath = rowAbove ? rowAbove.path : [];
  const aboveNode = rowAbove ? rowAbove.node : {};
  const targetDepth = getTargetDepth(dropTargetProps, monitor);

  // Cannot drop if we're adding to the children of the row above and
  //  the row above is a function
  if (
    targetDepth >= abovePath.length &&
    typeof aboveNode.children === 'function'
  ) {
    return false;
  }

  if (typeof dropTargetProps.customCanDrop === 'function') {
    const node = monitor.getItem().node;
    const addedResult = memoizedInsertNode({
      treeData: dropTargetProps.treeData,
      newNode: node,
      depth: targetDepth,
      getNodeKey: dropTargetProps.getNodeKey,
      minimumTreeIndex: dropTargetProps.listIndex,
      expandParent: true,
    });

    return dropTargetProps.customCanDrop({
      node,
      prevPath: monitor.getItem().path,
      prevParent: monitor.getItem().parentNode,
      prevTreeIndex: monitor.getItem().treeIndex,
      nextPath: addedResult.path,
      nextParent: addedResult.parentNode,
      nextTreeIndex: addedResult.treeIndex,
    });
  }

  return true;
}
// TODO: what my external drag source interacts with
const nodeDropTarget = {
    drop (dropTargetProps, monitor) {
      // console.log('treeData on drop:', dropTargetProps.treeData)
      return {
        node: dropTargetProps.node,
        path: dropTargetProps.path,
        treeIndex: dropTargetProps.treeIndex,
        treeData: dropTargetProps.treeData,
        depth: getTargetDepth(dropTargetProps,monitor)
      }
    },
  // drop(dropTargetProps, monitor) {
  //   return {
  //     node: monitor.getItem().node,
  //     path: monitor.getItem().path,
  //     minimumTreeIndex: dropTargetProps.treeIndex,
  //     depth: getTargetDepth(dropTargetProps, monitor),
  //   };
  // },

  // TODO: **ALL** moving around of tree nodes occurs _here_ but NOT setting of permanent tree state
  
  /* 
    FIXME: on hover the ONLY place that the new, external node can be seen in state
    is inside of the rows state object -NOT- (and should be) in treeData...
    which causes the new node to be lost on another node change or even another external
    node brought in 
  */
  hover(dropTargetProps, monitor) {
    // const targetDepth = getTargetDepth(dropTargetProps, monitor);
    // const draggedNode = monitor.getItem().node;
    const {
      node,
      treeIndex, 
      listIndex, 
    } = {...dropTargetProps}
    const hoveredOnNode = dropTargetProps.node
    const hoveredNodePath = dropTargetProps.path
    const hoveredNodePreviousRow = dropTargetProps.getPrevRow()
    const monitorGetItem = monitor.getItem()
    // console.log('monitorGetItem', monitorGetItem)
    const hoveredDepth = getTargetDepth(dropTargetProps,monitor)
    // console.log('hoveredDepth', hoveredDepth)
    // const treeData = monitor.getItem().treeData.slice()
    
    // console.log('passed data from my dragSource ->', monitor.getItem().treeData)
    const hoveredNode = {}
    hoveredNode.title = 'TEST NODE'
    hoveredNode.treeIndex = node.treeIndex + 1
    hoveredNode.subtitle = 'So this is something...'
    hoveredNode.children = []
    // hoveredNode.path = nextPath.push(node.treeIndex + 1)
    // const newNodeTEST = {
    //   title: 'TEST NODE',
    //   subtitle: 'So this is something...',
    //   children: []
    // }
    // TODO: here -> use dropTargetProps.node as input to create the required params for to create a 'synthetic' draggedNode
    // console.log('hovered node is ->', dropTargetProps.node)
    // console.log('hovered node is ->', dropTargetProps.node)
    // insert external node here
    // const hoveredInsertResultTree = memoizedInsertNode({
    //   treeData,
    //   depth: listIndex,
    //   minimumTreeIndex: listIndex,
    //   expandParent: true,
    //   getNodeKey: (treeIndex) => treeIndex,
    //   newNode: hoveredNode
    // }).treeData


    // monitor.getItem().updateTreeData(hoveredInsertResultTree)
    // dropTargetProps.updateFromNewHover(hoveredInsertResultTree)

    // console.log('insertResult ->', {...hoveredInsertResultTree})



    // const needsRedraw =
    //   // Redraw if hovered above different nodes
    //   dropTargetProps.node !== draggedNode ||
    //   // Or hovered above the same node but at a different depth
    //   targetDepth !== dropTargetProps.path.length - 1;

    // if (!needsRedraw) {
    //   return;
    // }

    // NOTE: -> kind of works but WAY too slow with external nodes...
    dropTargetProps.dragHover({
      node: hoveredNode,//draggedNode,
      path: dropTargetProps.path,//monitor.getItem().path,
      minimumTreeIndex: dropTargetProps.treeIndex,//dropTargetProps.listIndex,
      depth: hoveredDepth,//targetDepth,
      // isExternal: true
    });
  },

  // canDrop,
};

function nodeDragSourcePropInjection(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    didDrop: monitor.didDrop(),
  };
}

function nodeDropTargetPropInjection(connect, monitor) {
  const dragged = monitor.getItem();
  // console.log('isOver:', monitor.isOver())
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    // externalIsOver: monitor.getItem(),
    draggedNode: dragged ? dragged.node : null,
  };
}

export function dndWrapSource(el, type) {
  return dragSource(type, nodeDragSource, nodeDragSourcePropInjection)(el);
}

export function dndWrapTarget(el, type) {
  return dropTarget(type, nodeDropTarget, nodeDropTargetPropInjection)(el);
}

export function dndWrapRoot(el) {
  return dragDropContext(HTML5Backend)(el);
}
