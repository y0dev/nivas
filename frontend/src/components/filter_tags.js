import React from 'react';
import './css/filter_tag.css';
class FilterTag extends React.Component {
   
   componentDidUpdate() {
      // console.log(this.props)
      // console.log('updated')
   }
   render() {

      // console.log(this.props)
      return (
         <div onClick={this.props.handleChange} className={`filter_tag ${this.props.state ? 'type-meta-active' : 'type-meta'}`}>
            {this.props.type}
         </div>
      )
   }
}

export default FilterTag;