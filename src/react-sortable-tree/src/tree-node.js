import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
// import styles from './tree-node.scss';
import './tree-node.css';
class TreeNode extends Component {
  render() {
    const {
      children,
      listIndex,
      swapFrom,
      swapLength,
      swapDepth,
      scaffoldBlockPxWidth,
      lowerSiblingCounts,
      connectDropTarget,
      isOver,
      draggedNode,
      canDrop,
      treeIndex,
      /* eslint-disable no-unused-vars */
      customCanDrop: _customCanDrop, // Delete from otherProps
      dragHover: _dragHover, // Delete from otherProps
      getNodeKey: _getNodeKey, // Delete from otherProps
      getPrevRow: _getPrevRow, // Delete from otherProps
      maxDepth: _maxDepth, // Delete from otherProps
      node: _node, // Delete from otherProps
      path: _path, // Delete from otherProps
      treeData: _treeData, // Delete from otherProps
      /* eslint-enable no-unused-vars */
      ...otherProps
    } = this.props;

    // Construct the scaffold representing the structure of the tree
    const scaffoldBlockCount = lowerSiblingCounts.length;
    const scaffold = [];
    lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
      let lineClass = '';
      if (lowerSiblingCount > 0) {
        // At this level in the tree, the nodes had sibling nodes further down

        if (listIndex === 0) {
          // Top-left corner of the tree
          // +-----+
          // |     |
          // |  +--+
          // |  |  |
          // +--+--+
          lineClass = `${'lineHalfHorizontalRight'} ${'lineHalfVerticalBottom'}`;
        } else if (i === scaffoldBlockCount - 1) {
          // Last scaffold block in the row, right before the row content
          // +--+--+
          // |  |  |
          // |  +--+
          // |  |  |
          // +--+--+
          lineClass = `${'lineHalfHorizontalRight'} ${'lineFullVertical'}`;
        } else {
          // Simply connecting the line extending down to the next sibling on this level
          // +--+--+
          // |  |  |
          // |  |  |
          // |  |  |
          // +--+--+
          lineClass = 'lineFullVertical';
        }
      } else if (listIndex === 0) {
        // Top-left corner of the tree, but has no siblings
        // +-----+
        // |     |
        // |  +--+
        // |     |
        // +-----+
        lineClass = 'lineHalfHorizontalRight';
      } else if (i === scaffoldBlockCount - 1) {
        // The last or only node in this level of the tree
        // +--+--+
        // |  |  |
        // |  +--+
        // |     |
        // +-----+
        lineClass = `${'lineHalfVerticalTop'} ${'lineHalfHorizontalRight'}`;
      }

      scaffold.push(
        <div
          key={`pre_${i}`}
          style={{ width: scaffoldBlockPxWidth }}
          className={`${'lineBlock'} ${lineClass}`}
        />
      );

      if (treeIndex !== listIndex && i === swapDepth) {
        // This row has been shifted, and is at the depth of
        // the line pointing to the new destination
        let highlightLineClass = '';

        if (listIndex === swapFrom + swapLength - 1) {
          // This block is on the bottom (target) line
          // This block points at the target block (where the row will go when released)
          highlightLineClass = 'highlightBottomLeftCorner';
        } else if (treeIndex === swapFrom) {
          // This block is on the top (source) line
          highlightLineClass = 'highlightTopLeftCorner';
        } else {
          // This block is between the bottom and top
          highlightLineClass = 'highlightLineVertical';
        }

        scaffold.push(
          <div
            key={`highlight_${i}`}
            style={{
              width: scaffoldBlockPxWidth,
              left: scaffoldBlockPxWidth * i,
            }}
            className={`${'absoluteLineBlock'} ${highlightLineClass}`}
          />
        );
      }
    });

    return connectDropTarget(
      // TODO: kind of liking this approach to highlighting on isOver
      // <div {...otherProps} className={isOver ? 'nodeExternal' : 'node'}>
      <div {...otherProps} className={'node'}>
        {scaffold}

        <div
          className={isOver ? 'external' :'nodeContent'}
          style={{ left: scaffoldBlockPxWidth * scaffoldBlockCount }}
        >
          {Children.map(children, child =>
            cloneElement(child, {
              isOver,
              canDrop,
              draggedNode,
            })
          )}
        </div>
      </div>
    );
  }
}

TreeNode.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null,
  customCanDrop: null,
  maxDepth: null,
  treeData: null,
};

TreeNode.propTypes = {
  treeIndex: PropTypes.number.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,

  listIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,

  // Drop target
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),

  customCanDrop: PropTypes.func, // used in drag-and-drop-utils
  dragHover: PropTypes.func.isRequired, // used in drag-and-drop-utils
  getNodeKey: PropTypes.func.isRequired, // used in drag-and-drop-utils
  getPrevRow: PropTypes.func.isRequired, // used in drag-and-drop-utils
  maxDepth: PropTypes.number, // used in drag-and-drop-utils
  treeData: PropTypes.arrayOf(PropTypes.object), // used in drag-and-drop-utils
};

export default TreeNode;
