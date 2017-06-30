import React, { Component } from 'react'
import ExternalNode from '../ExternalNode'

class ExternalNodeContainer extends Component {
  render () {
    const myNode = {
      title:"-TEST NODE-",
      subtitle: 'another test node',
      children: []
    }
    return (
      <div style={{
        display:'flex', 
        flexDirection:'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px',
        margin: '0px',
        height: '500px',
        width: '100%',
      }}>
        <ExternalNode
          getTreeData={this.props.getTreeData}
          node={myNode}
          updateTreeData={this.props.updateTreeData}
        />
        <ExternalNode
          getTreeData={this.props.getTreeData}
          node={myNode}          
          updateTreeData={this.props.updateTreeData}          
        />
        <ExternalNode
          getTreeData={this.props.getTreeData}
          node={myNode}          
          updateTreeData={this.props.updateTreeData}
        />
        <ExternalNode
          getTreeData={this.props.getTreeData}    
          node={myNode}                
          updateTreeData={this.props.updateTreeData}
        />
      </div>
    )
  }
}

export default ExternalNodeContainer