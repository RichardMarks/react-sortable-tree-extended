import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { SortableTreeWithoutDndContext as SortableTree, toggleExpandedForAll } from './react-sortable-tree/src/';
import './react-sortable-tree/src/examples/basicExample/stylesheets/app.css';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ExternalNodeContainer from './ExternalNodeContainer'

// import './react-sortable-tree/src/examples/shared/favicon/apple-touch-icon.png';
// import './react-sortable-tree/src/examples/shared/favicon/favicon-16x16.png';
// import './react-sortable-tree/src/examples/shared/favicon/favicon-32x32.png';
// import './react-sortable-tree/src/examples/shared/favicon/favicon.ico';
// import './react-sortable-tree/src/examples/shared/favicon/safari-pinned-tab.svg';

const maxDepth = 5;

class App extends Component {
  constructor(props) {
    super(props);
    this.getTreeData = this.getTreeData.bind(this)

    // const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        {
          title: '`title`',
          subtitle: '`subtitle`',
          expanded: true,
          children: [
            {
              title: 'Child Node',
              subtitle: 'Defined in `children` array belonging to parent',
            },
            {
              title: 'Nested structure is rendered virtually',
              subtitle: (
                <span>
                  The tree uses&nbsp;
                  <a href="https://github.com/bvaughn/react-virtualized">
                    react-virtualized
                  </a>
                  &nbsp;and the relationship lines are more of a visual trick.
                </span>
              ),
            },
          ],
        },
        {
          expanded: true,
          title: 'Any node can be the parent or child of any other node',
          children: [
            {
              expanded: true,
              title: 'Chicken',
              children: [{ title: 'Egg' }],
            },
          ],
        },
        {
          title: 'Button(s) can be added to the node',
          subtitle:
            'Node info is passed when generating so you can use it in your onClick handler',
        },
        {
          title: 'Show node children by setting `expanded`',
          subtitle: ({ node }) =>
            `expanded: ${node.expanded ? 'true' : 'false'}`,
          children: [
            {
              title: 'Bruce',
              subtitle: ({ node }) =>
                `expanded: ${node.expanded ? 'true' : 'false'}`,
              children: [{ title: 'Bruce Jr.' }, { title: 'Brucette' }],
            },
          ],
        },
        /*{
          title: 'Advanced',
          subtitle: 'Settings, behavior, etc.',
          children: [
            {
              title: (
                <div>
                  <div
                    style={{
                      backgroundColor: 'gray',
                      display: 'inline-block',
                      borderRadius: 10,
                      color: '#FFF',
                      padding: '0 5px',
                    }}
                  >
                    Any Component
                  </div>

                  &nbsp;can be used for `title`
                </div>
              ),
            },
            {
              expanded: true,
              title: 'Limit nesting with `maxDepth`',
              subtitle: `It's set to ${maxDepth} for this example`,
              children: [
                {
                  expanded: true,
                  title: renderDepthTitle,
                  children: [
                    {
                      expanded: true,
                      title: renderDepthTitle,
                      children: [
                        { title: renderDepthTitle },
                        {
                          title: ({ path }) =>
                            path.length >= maxDepth
                              ? 'This cannot be dragged deeper'
                              : 'This can be dragged deeper',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title:
                'Disable dragging on a per-node basis with the `canDrag` prop',
              subtitle: 'Or set it to false to disable all dragging.',
              noDragging: true,
            },
            {
              title: 'You cannot give this children',
              subtitle:
                'Dropping is prevented via the `canDrop` API using `nextParent`',
              noChildren: true,
            },
            {
              title:
                'When node contents are really long, it will cause a horizontal scrollbar' +
                  ' to appear. Deeply nested elements will also trigger the scrollbar.',
            },
          ],
        }, */
      ],
    };

    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
  }

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  getTreeData() {
    const treeData = this.state.treeData.slice()
    return treeData
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  render() {
    const projectName = 'React Sortable Tree - External Nodes';

    const {
      treeData,
      searchString,
      searchFocusIndex,
      // searchFoundCount,
    } = this.state;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const objectString = Object.keys(node)
        .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
        .join(',\n   ');

      global.alert(
        'Info passed to the button generator:\n\n' +
          `node: {\n   ${objectString}\n},\n` +
          `path: [${path.join(', ')}],\n` +
          `treeIndex: ${treeIndex}`
      );
    };

    // const selectPrevMatch = () =>
    //   this.setState({
    //     searchFocusIndex: searchFocusIndex !== null
    //       ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
    //       : searchFoundCount - 1,
    //   });

    // const selectNextMatch = () =>
    //   this.setState({
    //     searchFocusIndex: searchFocusIndex !== null
    //       ? (searchFocusIndex + 1) % searchFoundCount
    //       : 0,
    //   });

    const isVirtualized = true;
    const treeContainerStyle = isVirtualized ? { height: '500px', border: '1px solid darkblue' } : {};

    return (
      <div>
        <section className={'page-header'}>
          <h1 className={'project-name'}>{projectName}</h1>

          <h2 className={'project-tagline'}>
            Drag-and-drop sortable representation of hierarchical data
          </h2>
        </section>

        <section className={'main-content'} style={{width: '800px'}}>
          {/*<h3>Demo</h3>

          <button onClick={this.expandAll}>
            Expand All
          </button>

          <button onClick={this.collapseAll}>
            Collapse All
          </button>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form
            style={{ display: 'inline-block' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;

              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event =>
                  this.setState({ searchString: event.target.value })}
              />
            </label>

            <button
              type="button"
              disabled={!searchFoundCount}
              onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
              type="submit"
              disabled={!searchFoundCount}
              onClick={selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </form>*/}

          <div style={treeContainerStyle}>
            <SortableTree
              treeData={treeData}
              onChange={this.updateTreeData}
              onMoveNode={({ node, treeIndex, path }) =>
                console.warn(
                  'node:',
                  node,
                  'treeIndex:',
                  treeIndex,
                  'path:',
                  path
                )}
              maxDepth={maxDepth}
              searchQuery={searchString}
              dndType={'NEW_NODE'}
              searchFocusOffset={searchFocusIndex}
              canDrag={({ node }) => !node.noDragging}
              canDrop={({ nextParent }) =>
                !nextParent || !nextParent.noChildren}
              searchFinishCallback={matches =>
                this.setState({
                  searchFoundCount: matches.length,
                  searchFocusIndex: matches.length > 0
                    ? searchFocusIndex % matches.length
                    : 0,
                })}
              isVirtualized={isVirtualized}
              generateNodeProps={rowInfo => ({
                buttons: [
                  <button
                    style={{
                      verticalAlign: 'middle',
                    }}
                    onClick={() => alertNodeInfo(rowInfo)}
                  >
                    ℹ
                  </button>,
                ],
              })}
            />
          </div>
        </section>
          <div className={'main-content'} style={{ border: '1px solid blue', height: '100%', width: '250px'}}>
            <ExternalNodeContainer
              getTreeData={this.getTreeData}
              updateTreeData={this.updateTreeData}
            />
          </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App)
