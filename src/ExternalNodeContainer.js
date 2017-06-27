import React, { Component } from 'react'
import ExternalNode from './ExternalNode'

class ExternalNodeContainer extends Component {
  render () {
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
        <ExternalNode/>
        <ExternalNode/>
        <ExternalNode/>
        <ExternalNode/>
      </div>
    )
  }
}

export default ExternalNodeContainer