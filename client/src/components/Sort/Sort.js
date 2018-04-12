
import React, { Component } from 'react';
import classes from './Sort.css'

class Sort extends Component{
     state={
         sortValue:""
     }
     handleChange(event){
        this.props.callBackFromParent(event.target.value);
         this.setState({
             sortValue:event.target.value
         })
     }
     render(){

        return(
            <div className={classes.mainSort}>
                <label >Order by </label>
                <select value={this.state.sortValue} onChange={this.handleChange.bind(this)}>
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                </select>
            </div>
        )
    }
}


export default Sort
