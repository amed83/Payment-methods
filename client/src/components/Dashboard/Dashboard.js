import React, { Component } from 'react';
import classes from './Dashboard.css';
import axios from 'axios';
import Sort from '../Sort/Sort';

class Dashboard extends Component {
    state={
        users:[],
        searchValue:"",
        searchOption:false,
        page:0,
        showDetails:false,
        detailsId:'',
        detailsButton:'Show Details',
        error:'',
        showPage:0,
        sortValue:"username"
    }

    sortValue(dataFromChild){

        this.setState({
            sortValue:dataFromChild,
        },()=>this.newSort(dataFromChild))
    }

    newSort(data){
        const {users,sortValue} = this.state
        if(users.length>0){
            const compare = (a,b)=>{
                if(a.sortValue < b.sortValue){
                    return -1
                }
                if(a.sortValue < b.sortValue){
                    return 1
                }
                return 0;
            }
            let newUserList = users.sort(compare)
            this.setState({users:newUserList})
        }
    }

    getData(){
        axios.get('/users/:0')
        .then(data=>{
            console.log('data for search',data)
            this.setState({
                users:data.data.Users
            },()=>this.newSort())
        }).catch(e=> this.setState({error: 'Error, please reload the page'}))
    }

    componentDidMount(){
        this.getData()
    }

    handleSearch(){
        if(!this.state.searchValue){
            this.setState({searchOption:false})
            this.getData()
        }else{
            this.setState({searchOption:true})
        }
    }

    handleChange(event){
            if(!event.target.value){
                this.setState({searchOption:false})
                this.setState({searchValue:event.target.value})
                this.getData()
            }else{
                this.setState({searchValue:event.target.value})
            }
    }

    renderDetails(id){
        if(this.state.showDetails && id===this.state.detailsId){
            this.setState({
                    showDetails:false
                })
        }else{
            this.setState({
                showDetails:true,
                detailsId:id,
            })
        }
    }

    changePage(goTo){
        let {page} = this.state
        //if you're already at page 0 you can't go to prev
        if(page===0 && goTo==='prev'){
            return
        }
        this.setState({page:goTo==='next' ? this.state.page+1 : this.state.page-1},(err)=>{
            axios.get(`/page/:${this.state.page}`)
            .then(data=>{
                if(data){
                    this.setState({
                        users:data.data.Users
                    },()=>this.setState({showPage:this.state.page}))
                }
            }).catch(err=> this.setState({error: 'Error, please reload the page'}))
        })
    }

    closeModal(){
        this.setState({showDetails:!this.state.showDetails})
    }
  render() {

        // let users= ""
        let singleUser= ""
        let selectid= ""
        let newDetails = ""
        let otherMethods= ""
        if(!this.state.searchOption){
              users = this.state.users.map(user=>{
                const paymentMethod = user.PaymentMethods.filter(method=> method.default===true)
                 .map(method=> <div className={classes.payMethod} key={user.id}>
                    {method.type} <span className={classes.currency}><i className="fa fa-money" style={{fontSize:'22px'}}></i> {method.currency}</span></div>
                )
             if(this.state.showDetails && this.state.users.length>0){
                    let selectUser = this.state.users.filter(user=> user.id ===this.state.detailsId)
                    if(selectUser.length>0){
                        selectid= selectUser[0].id
                        newDetails = selectUser.map(user=>{
                                otherMethods = user.PaymentMethods.map((method,i)=>{
                                   return(
                                       <div key={i}>
                                           <p><b>{i+1+`)`} Method</b>: {i+1} {method.name}</p>
                                           <ul>
                                              <li><b>Type</b>: {method.type}</li>
                                               <li><b>ID</b>: {method.id}</li>
                                               <li><b>Ending-with</b>: {method.ending_with}</li>
                                               <li><b>Currency</b>: {method.currency}</li>
                                               <li><b>Default</b>: {method.default ? 'Yes' : 'No'}</li>
                                           </ul>
                                        </div>
                                   )
                               })
                            return(
                                    <div
                                        style={{
                                            display: this.state.showDetails ? 'block' : 'none'
                                        }}
                                        className={classes.modal}>
                                            <div className= {classes.detailsList} key={user.id}>
                                               <span className={classes.closeButton} onClick={()=>this.closeModal()}>&times;</span>
                                               <p><b>Fist Name</b>: {user.name}</p>
                                               <p><b>Last Name</b>: {user.surname}</p>
                                               <p><b>Signup date</b>: {user.signup_date.substring(0,10)}</p>
                                               <p><b>All Payment Methods: </b>: {otherMethods}</p>
                                           </div>
                                   </div>
                               )
                        })
                    }
            }
             return  (
                 <div key={user.id} className={classes.usersList}>
                        <p><b>Username</b> : {user.username} </p>
                        <p><b>Id</b> : {user.id}</p>
                        <p><b> email </b>: {user.email}</p>
                        <p><b>Payment Method </b> :{paymentMethod}</p>
                        <button className={classes.detailsBtn}onClick={(id)=>this.renderDetails(user.id)}>{selectid===user.id ? 'Hide Details': 'Show Details'}</button>
                        <hr/>
                        <div className={classes.details}>
                            <p>{selectid===user.id  ? newDetails :null}</p>
                        </div>
                </div>
                 )
             })
        }else{
            //build single user view
            if(this.state.users){
                const {searchValue} = this.state
                let selectuser = this.state.users.filter(user=>user.email === searchValue)
                if(selectuser.length !== 0){
                    const paymentMethod2 = selectuser[0].PaymentMethods.filter(method=>method.default===true)
                            .map(method => <span key={selectuser.id}>
                            {method.type} <span className={classes.currency}><i className="fa fa-money" style={{fontSize:'22px'}}></i> {method.currency}</span></span>)

                    singleUser = (<div key={singleUser.id}>
                                    <p><b>Username</b> : {selectuser[0].username} </p>
                                    <p><b>Id</b> : {selectuser[0].id}</p>
                                    <p><b> email </b>: {selectuser[0].email} </p>
                                    <p><b>Payment Method </b> :{paymentMethod2}</p>
                                </div>)
                }
            }
        }
    return (
            <div>
                    <div className={classes.searchField}>
                            <input placeholder= {'Search by e-mail'}value={this.state.value} onChange={(event)=>this.handleChange(event)}/>
                            <a className={classes.searchBtn}href="#" onClick={()=> this.handleSearch()}>Search</a>
                    </div>
                    <div className={classes.changePage}>
                            <div onClick={(goTo)=>this.changePage(goTo='prev')}><a href="#">Prev Page</a></div>
                                        <h2 className={classes.pages}>{this.state.showPage}</h2>
                            <div onClick={(goTo)=>this.changePage(goTo='next')}><a href="#">Next Page</a></div>
                    </div>

                    <div className={classes.usersContainer}>
                        {users}
                        {singleUser}
                        {this.state.error}
                    </div>
            </div>
        )
    }
}
export default Dashboard


// <div className={classes.sortOptions}>
//         <Sort users={this.state.users} callBackFromParent={this.sortValue.bind(this)} />
// </div>
