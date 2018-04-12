import React, { Component }  from 'react'
import classes from './Modal.css'
import Backdrop from '../Backdrop/Backdrop'

class Modal extends Component {

    constructor(props){
        super(props)
    }
    render(){
        let selectid= ""
        let newDetails = ""
        let otherMethods= ""
        let users=""
        let selectUser = this.props.users.filter(user=> user.id ===this.props.detailsId)
        users = this.props.users.map(user=>{
            const paymentMethod = user.PaymentMethods.filter(method=> method.default===true)
            .map(method=> <div key={user.id}>
               {method.type}, currency: {method.currency}</div>
                )
               let selectUser = this.props.users.filter(user=> user.id ===this.props.detailsId)
               if(selectUser.length>0){
                   selectid= selectUser[0].id
                   newDetails = selectUser.map(user=>{
                           otherMethods = user.PaymentMethods.map((method,i)=>{
                              return(
                                  <div key={i}>
                                      <p><b>{i+1} Method</b>: {i+1} {method.name}</p>
                                      <ul>
                                          <li><b>ID</b>: {method.id}</li>
                                          <li><b>Ending-with</b>: {method.ending_with}</li>
                                          <li><b>Currency</b>: {method.currency}</li>
                                          <li><b>Default</b>: {method.default ? 'Yes' : 'No'}</li>
                                      </ul>
                                  </div>
                                )
                              })
                          })
                       return(
                               <div className= {classes.detailsList} key={user.id}>
                                  <p><b>Fist Name</b>: {user.name}</p>
                                  <p><b>Last Name</b>: {user.surname}</p>
                                  <p><b>Signup date</b>: {user.signup_date.substring(0,10)}</p>
                                  <p><b>All Payment Methods: </b>: {otherMethods}</p>
                              </div>
                          )
                   }
               })
        return(
            <div>
                {users}
            </div>
        )
    }
}


export default Modal
